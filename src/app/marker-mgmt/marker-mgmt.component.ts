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
  ) {
   }

  ngOnInit() {
    // Getting location data from Geolocation API
    this.geoService.getLocation().subscribe(
      (coordinates: Coordinates) => {
        // Gets marker data
        this.getMarkerData();

        // Sets google map coordinates
        this.coordinates = coordinates;
      },
      (err) => { // Set location manually if there is an error
        // Gets marker data
        this.getMarkerData();

        // Sets google map coordinates
        this.coordinates = new Coordinates({
          latitude: 10.024643,
          longitude: 76.307861
        });

        this.snackBar.open(err, 'Dismiss', {
          duration: 3000,
        });
      }
    );
  }

  /**
   * Gets the marker data
   */
  getMarkerData() {
    this.storage.getAllMarkers().subscribe(
      (markers) => {
        this.userMarkers = markers;
      }
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
   * @param  {object} marker
   */
  saveMarker(marker) {
    if (typeof marker.id !== null && marker.action === 'update') {
      this.storage.setMarker(marker).subscribe(() => {
        // Updates marker data
        this.getMarkerData();
      });
    } else {
      this.storage.setMarker({
        id: this.storage.guid(),
        action: marker.action,
        name: marker.name,
        note: marker.note,
        latitude: this.coordinates.latitude,
        longitude: this.coordinates.longitude
      }).subscribe(() => {
        // Updates marker data
        this.getMarkerData();
      });
    }
  }

  /**
   * Delete given marker data
   * @param  {object} form
   */
  deleteMarker(marker: Marker) {
    this.storage.deleteMarker(marker.id).subscribe(
      () => {
        // Updates marker data
        this.getMarkerData();
      }
    );
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
      this.selectedMarker.action = 'update';
      this.selectedMarker.latitude = event.coords.lat;
      this.selectedMarker.longitude = event.coords.lng;
      this.saveMarker(this.selectedMarker);
    }
  }

  /**
   * On user marker click event opens the dialog window for updating the
   * clicked marker
   * @param  {Marker} marker
   */
  onUserMarkerClick(marker: Marker) {
    if (typeof marker !== 'undefined') {
      this.selectedMarker = marker;

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
