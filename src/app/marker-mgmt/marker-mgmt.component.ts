import { Component, OnInit } from '@angular/core';
import { GeolocationService } from './../services/geolocation.service';
import { MatSnackBar } from '@angular/material';
import { Coordinates } from './../models/Coordinates';
import { MatDialog, MatDialogRef } from '@angular/material';
import { StorageService } from '../services/storage.service';
import { Marker } from '../models/Marker';
import {MarkerDialogComponent} from './marker-dialog/marker-dialog.component';

@Component({
  selector: 'app-marker-mgmt',
  templateUrl: './marker-mgmt.component.html',
  styleUrls: ['./marker-mgmt.component.css']
})
export class MarkerMgmtComponent implements OnInit {

  coordinates: Coordinates;
  selectedMarker: Marker;
  userMarkers: Marker[];

  constructor(
    private geoService: GeolocationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private storage: StorageService
  ) { }

  ngOnInit() {
    // Getting location data from Geolocation API
    this.geoService.getLocation().subscribe(
      (coordinates: Coordinates) => {
        this.coordinates = coordinates;
      },
      (err) => { // Set location manually if there is an error
          this.coordinates = new Coordinates({
            latitude: 10.024643,
            longitude: 76.307861
          });

          this.snackBar.open(err, 'Dismiss', {
            duration: 3000,
          });
      }
    );

    this.storage.getAllMarkers().subscribe(
      (markers) => this.userMarkers = markers
    );
  }

  /**
   * Updates the marker position when user click on the map
   * @param event EventEmitter Containing location of the clicked area
   */
  onMapClick(event) {
    if (typeof event.coords !== 'undefined') {
      this.coordinates.latitude = event.coords.lat;
      this.coordinates.longitude = event.coords.lng;
    }
  }

  /**
   * Updates the marker position when user stops the dragging marker.
   * @param event EventEmitter Containing location of the clicked area
   */
  onMarkerDragEnd(event) {
    if (typeof event.coords !== 'undefined') {
      this.coordinates.latitude = event.coords.lat;
      this.coordinates.longitude = event.coords.lng;
    }
  }

  /**
   * Event that triggers when user clicks on the marker
   */
  onMarkerClick() {
    const dialogRef = this.dialog.open(MarkerDialogComponent, {
      data: {
        id: null,
        action: 'create',
        name: null,
        note: null,
        latitude: this.coordinates.latitude,
        longitude: this.coordinates.longitude
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.saveMarker(result);
    });
  }

  /**
   * Marker dialog submit event
   * @param  {object} form
   */
  saveMarker(form) {
    if (typeof form.id !== null && form.action === 'update') {
      console.log('update', form);
      // TODO: Update stored data
    } else {
      this.storage.setMarker({
        id: this.storage.guid(),
        name: form.name,
        note: form.note,
        latitude: this.coordinates.latitude,
        longitude: this.coordinates.longitude
      }).subscribe(() => {
        this.storage.getAllMarkers().subscribe(
          (markers: Marker[]) => {
            this.userMarkers = markers;
          }
        );
      });
    }
  }

  /**
   * Delete given marker data
   * @param  {object} form
   */
  deleteMarker(form) {
    console.log('delete', form);
    // TODO: Delete marker
  }


  /**
   * On user marker click event, update the coordinates of the
   * selected marker
   * @param  {EventEmitter} event
   * @param  {Marker} marker
   */
  onUserMarkerDragEnd(event, marker: Marker) {
    if (typeof marker !== 'undefined' && typeof event.coords !== 'undefined') {
      this.selectedMarker = marker;
      this.selectedMarker.latitude = event.coords.lat;
      this.selectedMarker.longitude = event.coords.lng;
    }
  }

  /**
   * On user marker click event opens the dialog window for updating the
   * clicked marker
   * @param  {Marker} marker
   */
  onUserMarkerClick(marker: Marker) {
    if (typeof marker !== 'undefined') {
      if (typeof this.selectedMarker === 'undefined') {
        this.selectedMarker = marker;
      }
      const dialogRef = this.dialog.open(MarkerDialogComponent, {
        data: {
          id: this.selectedMarker.id,
          action: 'update',
          name: this.selectedMarker.name,
          note: this.selectedMarker.note,
          latitude: this.selectedMarker.latitude,
          longitude: this.selectedMarker.longitude
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (typeof result !== 'undefined') {
          if (result.action === 'update') {
            this.saveMarker(result);
          } else if (result.action === 'delete') {
            this.deleteMarker(result);
          }
        }
      });
    }
  }
}
