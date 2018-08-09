import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Marker } from '../models/Marker';
import {mergeMap} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private localStorage: LocalStorage
  ) { }

  /**
   * Insert/Update the marker data to the localStorage
   * @param  {Marker} marker
   * @returns {Observable}
   * @throws Error if marker id for new marker is undefined or
   * if can't find the marker data
   */
  setMarker(marker: Marker) {
    console.log(marker.action, marker);
    if (typeof marker.id !== 'undefined') {
      return this.localStorage.getItem('marker').pipe(
        mergeMap((markerData: Marker[]) => {
          if (typeof markerData === 'undefined' || markerData === null) {
            return this.localStorage.setItem('marker', [marker]);
          } else {
            // Create/Update marker based on marker action
            if (marker.action === 'create') {
              markerData.push(marker);
              return this.localStorage.setItem('marker', markerData);
            } else if (marker.action === 'update') {
              const markerIndex = markerData.findIndex(
                (mkr: Marker) => mkr.id === marker.id
              );

              if (typeof markerIndex !== 'undefined' &&
                  typeof markerData[markerIndex] !== 'undefined'
              ) {
                markerData[markerIndex] = marker;
                return this.localStorage.setItem('marker', markerData);
              } else {
                throw new Error('Sorry :( Marker is not found');
              }
            }
          }
        })
      );
    } else {
      throw new Error('Oops! Marker Id is not defined');
    }
  }
  /**
   * Deletes marker from localStorage
   * @param  {string} markerId
   * @returns {Observable}
   * @throws Error if can't find the marker data
   */
  deleteMarker(markerId: string) {
    return this.localStorage.getItem('marker').pipe(
      mergeMap(
        (markerData: Marker[]) => {
          const markerIndex = markerData.findIndex(
            (mkr: Marker) => mkr.id === markerId
          );

          if (typeof markerIndex !== 'undefined' &&
              typeof markerData[markerIndex] !== 'undefined'
          ) {
            markerData.splice(markerIndex, 1);
            return this.localStorage.setItem('marker', markerData);
          } else {
            throw new Error('Sorry :( Marker is not found');
          }
        }
      )
    );
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
    // this.localStorage.clearSubscribe();
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
