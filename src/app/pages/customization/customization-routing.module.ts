import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddParkingComponent} from "./parking/add-parking/add-parking.component";
import {AllParkingComponent} from "./parking/all-parking/all-parking.component";

const routes: Routes = [

  {path: 'add-parking', component: AddParkingComponent},
  {path: 'edit-parking/:id', component: AddParkingComponent},
  {path: 'all-parking', component: AllParkingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomizationRoutingModule {
}
