import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomizationRoutingModule} from './customization-routing.module';

import {FormsModule} from '@angular/forms';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {NgxPaginationModule} from 'ngx-pagination';
import {MaterialModule} from 'src/app/material/material.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatIconModule} from '@angular/material/icon';
import {AddParkingComponent} from './parking/add-parking/add-parking.component';
import {AllParkingComponent} from './parking/all-parking/all-parking.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

@NgModule({
  declarations: [

    AddParkingComponent,
    AllParkingComponent,

  ],
  imports: [
    CommonModule,
    CustomizationRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    DirectivesModule,
    NgxSpinnerModule,
    MatIconModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ]
})
export class CustomizationModule {
}
