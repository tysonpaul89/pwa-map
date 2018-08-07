import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Marker } from '../models/Marker';
import {mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private localStorage: LocalStorage
  ) { }

  /**
   * Stores the marker data to the localStorage with unique id as index
   * @param  {Marker} marker
   * @returns {boolean}
   * @throws Will throw error if marker id is undefined
   */
  setMarker(marker: Marker) {
    console.log('create', marker);
    if (typeof marker.id !== 'undefined') {
      return this.localStorage.getItem('marker').pipe(
        mergeMap((markerData: Marker[]) => {
          if (typeof markerData === 'undefined' || markerData === null) {
            return this.localStorage.setItem('marker', [marker]);
          } else {
            markerData.push(marker);
            return this.localStorage.setItem('marker', markerData);
          }
        })
      );
    } else {
      throw new Error('Marker Id is not defined');
    }
  }


  /**
   * Gets the Marker data of the given marker id
   * @param  {string} markerId Unique Id of the marker
   * @returns {Marker | null} If marker data not found, then returns null
   */
  getMarker(markerId: string) {
    return this.localStorage.getItem<Marker>(markerId);
  }

  getAllMarkers() {
    return this.localStorage.getItem('marker');
  }

  /**
   * Generated a unique string unique id
   */
  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  /**
   * Generated a unique string for creating a unique id
   */
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

}
