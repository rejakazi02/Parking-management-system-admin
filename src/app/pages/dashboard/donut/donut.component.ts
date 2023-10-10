import {Component, OnInit, ViewChild} from '@angular/core';
import {ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent} from 'ng-apexcharts';
import {Subscription} from 'rxjs';
import {AdminService} from 'src/app/services/admin/admin.service';
import {DashboardService} from 'src/app/services/common/dashboard.service';
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ParkingService} from "../../../services/common/parking.service";
import {Parking} from "../../../interfaces/common/parking.interface";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss'],
})
export class DonutComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;


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
    private dashboardService: DashboardService,
    private adminService: AdminService,
    private parkingService: ParkingService,
  ) {
    this.chartOptions = {
      series: [0, 0, 0, 0],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
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


          const carDATA=  this.parkings.filter(f => f.vehicleType === 'car');
          const truckDATA=  this.parkings.filter(f => f.vehicleType === 'truck');
          const microbusDATA=  this.parkings.filter(f => f.vehicleType === 'microbus');
          this.totalCars = carDATA.length;
          this.totalTrucks = truckDATA.length;
          this.totalMicrobus = microbusDATA.length;

          // rount chart
          const mul: any[] = [
            this.totalCars,
            this.totalTrucks,
            this.totalMicrobus,

          ];
          this.chartOptions = {
            series: mul,
            chart: {
              width: 500,
              type: 'pie',
            },
            labels: [
              ' Total Cars',
              'Total Trucks',
              'Total Microbus',
            ],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 300,
                  },
                  legend: {
                    position: 'bottom',
                  },
                },
              },
            ],
          };
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
