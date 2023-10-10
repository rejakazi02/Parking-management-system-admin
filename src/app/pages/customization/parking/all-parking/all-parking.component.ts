import {Component, OnInit, ViewChild} from '@angular/core';
import {UiService} from '../../../../services/core/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReloadService} from '../../../../services/core/reload.service';
import {EMPTY, Subscription} from 'rxjs';
import {FilterData} from '../../../../interfaces/gallery/filter-data';
import {Parking} from '../../../../interfaces/common/parking.interface';
import {ParkingService} from '../../../../services/common/parking.service';
import {AdminPermissions} from 'src/app/enum/admin-permission.enum';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {UtilsService} from '../../../../services/core/utils.service';
import {debounceTime, distinctUntilChanged, pluck, switchMap,} from 'rxjs/operators';
import {Pagination} from '../../../../interfaces/core/pagination';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmDialogComponent} from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {AdminService} from '../../../../services/admin/admin.service';

@Component({
  selector: 'app-all-parking',
  templateUrl: './all-parking.component.html',
  styleUrls: ['./all-parking.component.scss']
})
export class AllParkingComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Store Data
  toggleMenu: boolean = false;
  parkings: Parking[] = [];
  holdPrevData: Parking[] = [];
  parkingCount = 0;
  id?: string;

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // Date
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Search Area
  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery = null;
  searchParking: Parking[] = [];


  // Pagination
  currentPage = 1;
  totalParkings = 0;
  ParkingsPerPage = 5;
  totalParkingsStore = 0;

  // FilterData
  filter: any = null;
  sortQuery: any = null;
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeSort: number;
  number = [{num: '10'}, {num: '25'}, {num: '50'}, {num: '100'}];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;

  constructor(
    private adminService: AdminService,
    private parkingService: ParkingService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    // Reload Data
    this.subReload = this.reloadService.refreshBrand$.subscribe(() => {
      this.getAllParking();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      this.getAllParking();
    });

    // Base Data
    this.getAdminBaseData();
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue
      .pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data;
          if (this.searchQuery === '' || this.searchQuery === null) {
            this.searchParking = [];
            this.parkings = this.holdPrevData;
            this.totalParkings = this.totalParkingsStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.ParkingsPerPage),
            currentPage: Number(this.currentPage) - 1,
          };

          // Select
          const mSelect = {
            name: 1,
            vehicleType: 1,
            licenseNo: 1,
            carEntry: 1,
            carExit: 1,
            status: 1,
            createdAt: 1,

          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: {createdAt: -1},
          };

          return this.parkingService.getAllParking(filterData, this.searchQuery);
        })
      )
      .subscribe({
        next: (res) => {
          this.searchParking = res.data;
          this.parkings = this.searchParking;
          this.totalParkings = res.count;
          this.currentPage = 1;
          this.router.navigate([], {queryParams: {page: this.currentPage}});
        },
        error: (error) => {
          console.log(error);
        },
      });
  }


  /**
   * CHECK ADMIN PERMISSION
   * getAdminBaseData()
   * checkAddPermission()
   * checkDeletePermission()
   * checkEditPermission()
   */

  private getAdminBaseData() {
    this.adminId = this.adminService.getAdminId();
    this.role = this.adminService.getAdminRole();
    this.permissions = this.adminService.getAdminPermissions();
  }

  get checkAddPermission(): boolean {
    return this.permissions.includes(AdminPermissions.CREATE);
  }

  get checkDeletePermission(): boolean {
    return this.permissions.includes(AdminPermissions.DELETE);
  }

  get checkEditPermission(): boolean {
    return this.permissions.includes(AdminPermissions.EDIT);
  }


  /**
   * Pagination
   * onPageChanged()
   */

  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * HTTP REQ HANDLE
   * getAllParking()
   * deleteMultipleParkingById()
   */

  private getAllParking() {
    // Select
    const mSelect = {
      name: 1,
      vehicleType: 1,
      licenseNo: 1,
      carEntry: 1,
      carExit: 1,
      status: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataOne = this.parkingService.getAllParking(filter, null).subscribe({
      next: (res) => {
        if (res.success) {
          this.parkings = res.data;
          this.parkingCount = res.count;
          this.holdPrevData = this.parkings;
          this.totalParkingsStore = this.parkingCount;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private deleteMultipleParkingById() {
    this.spinner.show();
    this.subDataTwo = this.parkingService
      .deleteMultipleParkingById(this.selectedIds)
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res.success) {
            // Get Data array
            const selectedParking = [];
            this.selectedIds.forEach((id) => {
              const fData = this.parkings.find((data) => data._id === id);
              if (fData) {
                selectedParking.push(fData);
              }
            });


            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}});
            } else {
              this.getAllParking();
            }
          } else {
            this.uiService.warn(res.message);
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }


  /**
   * DATA Sorting
   * sortData()
   * onRemoveAllQuery()
   */


  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllParking();
  }


  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllParking();
    }
  }

  /**
   * ON Select Check
   * onCheckChange()
   * onAllSelectChange()
   */

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex((f) => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.parkings.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.parkings.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.parkings.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   */
  public openConfirmDialog(type: string) {
    switch (type) {
      case 'delete': {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Delete',
            message: 'Are you sure you want delete this data?',
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            this.deleteMultipleParkingById();
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }


  /**
   * ON DESTROY
   * ngOnDestroy()
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }

    if (this.subForm) {
      this.subForm.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subReload) {
      this.subReload.unsubscribe();
    }
  }
}
