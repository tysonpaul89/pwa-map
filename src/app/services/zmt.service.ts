import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZmtService {
  zmtToken = '6faa97e3057fa4182044234b85fc1cbf';
  zmtUrl = 'https://developers.zomato.com/api/v2.1';

  constructor(private http: HttpClient) { }

  /**
   * Search for Zomato locations by geo co-ordinates.
   * @param lat Latitude
   * @param lng Longitude
   */
  getLocationsByLatLng(lat, lng) {
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type':  'application/json',
        'user-key': this.zmtToken
      }),
      params : new HttpParams().append('lat', lat)
        .append('lon', lng).append('count', '1')
    };

    return this.http.get(this.zmtUrl + '/locations', httpOptions);
  }

  /**
   * Get near by restaurants in a given location
   * @param locationData Current location data
   */
  getLocationDetails(locationData) {
    if (typeof locationData.location_suggestions[0] !== 'undefined') {
      const entityData = locationData.location_suggestions[0];

      if (typeof entityData.entity_id !== 'undefined' &&
          typeof entityData.entity_type !== 'undefined'
      ) {
        const httpOptions = {
          headers : new HttpHeaders({
            'Content-Type':  'application/json',
            'user-key': this.zmtToken
          }),
          params : new HttpParams().append('entity_id', entityData.entity_id)
            .append('entity_type', entityData.entity_type)
        };
        return this.http.get(this.zmtUrl + '/location_details', httpOptions);
      }
    }
  }

  /**
   * Gets restaurant data
   * @param restaurantId Restaurant Id
   */
  getRestaurant(restaurantId) {
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type':  'application/json',
        'user-key': this.zmtToken
      }),
      params : new HttpParams().set('res_id', restaurantId)
    };
    return this.http.get(this.zmtUrl + '/restaurant', httpOptions);
  }

}
