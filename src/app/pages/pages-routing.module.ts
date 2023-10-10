import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CheckAuthAccessGuard} from '../auth-guard/check-auth-access.guard';
import {PagesComponent} from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [CheckAuthAccessGuard]
      },

      {
        path: 'gallery',
        loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule),
        // canActivate: [CheckAuthAccessGuard],
      },

      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },

      {
        path: 'customization',
        loadChildren: () => import('./customization/customization.module').then(m => m.CustomizationModule),
      },

      {
        path: 'admin-control',
        loadChildren: () => import('./admin-control/admin-control.module').then(m => m.AdminControlModule),
        // canActivate: [CheckAuthAccessGuard]
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PagesRoutingModule {
}
