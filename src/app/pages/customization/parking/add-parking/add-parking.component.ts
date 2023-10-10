import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Parking} from 'src/app/interfaces/common/parking.interface';
import {UiService} from '../../../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ParkingService} from '../../../../services/common/parking.service';
import {Select} from 'src/app/interfaces/core/select';


interface AccessOption {
  name: string;
  value: boolean;
}

interface AccessOptionn {
  name: string;
  value: boolean;
}


@Component({
  selector: 'app-add-parking',
  templateUrl: './add-parking.component.html',
  styleUrls: ['./add-parking.component.scss']
})
export class AddParkingComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  parking?: Parking;
  autoSlug = true;


  vehicleTypeControl = new FormControl<AccessOption | null>(
    null,
    Validators.required
  );


  statusControl = new FormControl<AccessOptionn | null>(
    null,
    Validators.required
  );

  vehicleTypeAccess: Select[] = [
    {value: 'microbus', viewValue: 'Microbus'},
    {value: 'car', viewValue: 'Car'},
    {value: 'truck', viewValue: 'Truck'},

  ];

  statusAccess: Select[] = [
    {value: 'yes', viewValue: 'Yes'},
    {value: 'no', viewValue: 'No'},

  ];


  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;
  private subAutoSlug: Subscription;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private parkingService: ParkingService,
  ) {
  }

  ngOnInit(): void {
    // Init Form
    this.initDataForm();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getParkingById();
      }
    });

    // Auto Slug
    this.autoGenerateSlug();
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null],
      slug: [null],
      phoneNo: [null],
      carOwnerAddress: [null],
      status: [null],
      carEntry: [null],
      carExit: [null],
      parkingCharge: [null],
      vehicleType: [null],
      licenseNo: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.parking);


  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    if (!this.parking) {
      this.addParking();
    } else {
      this.updateParkingById();
    }
  }

  /**
   * HTTP REQ HANDLE
   * getParkingById()
   * addParking()
   * updateParkingById()
   */

  private getParkingById() {
    this.spinnerService.show();
    this.subDataOne = this.parkingService.getParkingById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.parking = res.data;

          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addParking() {
    this.spinnerService.show();
    this.subDataTwo = this.parkingService
      .addParking(this.dataForm.value)
      .subscribe({
        next: (res) => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
            this.formElement.resetForm();

          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.spinnerService.hide();
          console.log(error);
        },
      });
  }

  private updateParkingById() {
    this.spinnerService.show();
    this.subDataThree = this.parkingService
      .updateParkingById(this.parking._id, this.dataForm.value)
      .subscribe({
        next: (res) => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.spinnerService.hide();
          console.log(error);
        },
      });
  }

  /**
   * LOGICAL PART
   * autoGenerateSlug()
   */
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.subAutoSlug = this.dataForm.get('name').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = d?.trim().replace(/\s+/g, '-').toLowerCase();
          this.dataForm.patchValue({
            slug: res
          });
        });
    } else {
      if (!this.subAutoSlug) {
        return;
      }
      this.subAutoSlug?.unsubscribe();
    }
  }


  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
  }
}
