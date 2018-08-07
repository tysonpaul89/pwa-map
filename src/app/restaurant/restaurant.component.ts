import { Coordinates } from './../models/Coordinates';
import { Restaurant } from './../models/Restaurant';
import { GeolocationService } from './../services/geolocation.service';
import { Component, OnInit } from '@angular/core';
import { ZmtService } from '../services/zmt.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {

  nearByRestaurants: Restaurant[] = new Array();
  coordinates: Coordinates;

  constructor(
    private zmtService: ZmtService,
    private geoService: GeolocationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.geoService.getLocation().subscribe(
      (coordinates: Coordinates) => {
        this.coordinates = coordinates;
        // Displays restaurants near me from Zomato's API
        this.getNearByRestaurantData();
      },
      (err) => {
          this.coordinates = new Coordinates({
            latitude: 10.024643,
            longitude: 76.307861
          });

          // Displays restaurants near me from Zomato's API
          this.getNearByRestaurantData();
          this.snackBar.open(err, 'Dismiss', {
            duration: 3000,
          });
      }
    );
  }

  /**
   * To get restaurant data from given geo co-ordinates
   * @param lat Latitude
   * @param lng Longitude
   */
  getNearByRestaurantData() {
    const locationDetails: Observable<object> =
      this.zmtService.getLocationsByLatLng(
        this.coordinates.latitude,
        this.coordinates.longitude
      )
      .pipe(
        mergeMap(locationData => this.zmtService.getLocationDetails(locationData))
      );

    if (typeof locationDetails !== 'undefined') {
      locationDetails.subscribe(
        (locationDetailsData: any) => {
          if (typeof locationDetailsData.nearby_res !== 'undefined' &&
            locationDetailsData.nearby_res.length
          ) {
            const restaurantObservables = new Array();
            locationDetailsData.nearby_res.forEach(restaurantId => {
              restaurantObservables.push( this.zmtService.getRestaurant(restaurantId));
            });

            forkJoin(restaurantObservables).subscribe(
              (restaurantResponse) => {
                restaurantResponse.forEach(restaurantData => {
                  if (typeof restaurantData.id !== 'undefined') {
                    this.nearByRestaurants.push({
                      id: +restaurantData.id,
                      name: restaurantData.name,
                      address: restaurantData.location.address,
                      url: restaurantData.url,
                      lat: +restaurantData.location.latitude,
                      lng: +restaurantData.location.longitude,
                      image: restaurantData.thumb.length
                        ? restaurantData.thumb : restaurantData.featured_image
                    });
                  }
              });
            });
          }
        });
    }
  }

}
