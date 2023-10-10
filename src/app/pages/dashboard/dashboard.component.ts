import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FilterData} from "../../interfaces/core/filter-data";
import {ParkingService} from "../../services/common/parking.service";
import {Parking} from "../../interfaces/common/parking.interface";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  // FilterData
  filter: any = null;

  // Pagination
  currentPage = 1;
  totalParkings = 0;
  ParkingsPerPage = 5;
  totalParkingsStore = 0;

  // Store Data
  toggleMenu: boolean = false;
  parkings: Parking[] = [];
  holdPrevData: Parking[] = [];
  parkingCount = 0;

  constructor(
    private parkingService: ParkingService,
  ) {

  }

  USER_ROLE: any;

  totalCars: any;
  totalTrucks: any;
  totalMicrobus: any;
  monthlyDeliveredOrders: any;

  // Subscriptions
  private subDataOne: Subscription;

  ngOnInit(): void {

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


          const carDATA = this.parkings.filter(f => f.vehicleType === 'car');
          const truckDATA = this.parkings.filter(f => f.vehicleType === 'truck');
          const microbusDATA = this.parkings.filter(f => f.vehicleType === 'microbus');
          this.totalCars = carDATA.length;
          this.totalTrucks = truckDATA.length;
          this.totalMicrobus = microbusDATA.length;

          console.log('  this.totalCars',  this.totalCars)

        }
      },
      error: (err) => {
        console.log(err);
      },
    });


  }


  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }
}

