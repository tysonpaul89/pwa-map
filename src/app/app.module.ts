import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomeComponent } from './home/home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { MarkerMgmtComponent } from './marker-mgmt/marker-mgmt.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MarkerDialogComponent } from './marker-mgmt/marker-dialog/marker-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RestaurantComponent,
    MarkerMgmtComponent,
    NavigationComponent,
    MarkerDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AppMaterialModule,
    LayoutModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDpdDbsXX60QaKDcKHJN72NFOAFZ7VzKCY',
    }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    MarkerDialogComponent
  ]
})
export class AppModule { }
