import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Marker } from '../../models/Marker';

@Component({
  selector: 'app-marker-dialog',
  templateUrl: './marker-dialog.component.html',
  styleUrls: ['./marker-dialog.component.css']
})
export class MarkerDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MarkerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Marker) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
