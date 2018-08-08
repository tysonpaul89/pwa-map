import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { RestaurantComponent } from '../restaurant/restaurant.component';
import { MarkerMgmtComponent } from '../marker-mgmt/marker-mgmt.component';
import { QrScannerComponent } from '../qr-scanner/qr-scanner.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'restaurant', component: RestaurantComponent},
  {path: 'marker-mgmt', component: MarkerMgmtComponent},
  {path: 'qr-scanner', component: QrScannerComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
