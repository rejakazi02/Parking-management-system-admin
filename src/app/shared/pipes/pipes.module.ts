import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NumberMinDigitPipe} from './number-min-digit.pipe';
import {SecToTimePipe} from './sec-to-time.pipe';
import { OrderStatusPipe } from './order-status.pipe';
import { CheckNullPipe } from './check-null.pipe';
import { SlugToNormalPipe } from './slug-to-normal.pipe';
import { SafeHtmlCustomPipe } from './safe-html.pipe';


@NgModule({
  declarations: [
    NumberMinDigitPipe,
    SecToTimePipe,
    OrderStatusPipe,
    CheckNullPipe,
    SlugToNormalPipe,
    SafeHtmlCustomPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberMinDigitPipe,
    SecToTimePipe,
    OrderStatusPipe,
    CheckNullPipe,
    SlugToNormalPipe,
    SafeHtmlCustomPipe
  ]
})
export class PipesModule {
}
