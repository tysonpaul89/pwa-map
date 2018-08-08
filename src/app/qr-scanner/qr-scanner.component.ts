import { Component, VERSION, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import {MatSelectChange, MatDialog, MatSnackBar} from '@angular/material';
import { QrDialogComponent } from './qr-dialog/qr-dialog.component';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit {

  ngVersion = VERSION.full;

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  constructor(private dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit(): void {

      this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
          this.hasCameras = true;
          this.availableDevices = devices;
          // Select first available device by defult
          this.selectedDevice = this.availableDevices[0];

          if (!this.hasCameras && this.hasPermission === true) {
            this.snackBar.open(
              'Looks like your actual device does not has cameras,' +
              ' or I could no find\'em.',
              'Dismiss'
            );
          }

          if (this.hasPermission === false) {
            this.snackBar.open(
              'You denied the camera permissions,' +
              '  we can\'t scan anything without it.',
              'Dismiss'
            );
          }
      });

      this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
        this.snackBar.open('Opps! Camera devices not found', 'Dismiss');
      });

      this.scanner.permissionResponse.subscribe((answer: boolean) => {
        this.hasPermission = answer;
      });

  }

  handleQrCodeResult(resultString: string) {
      this.hasCameras = false;
      this.qrResultString = resultString;
      const dialogRef = this.dialog.open(QrDialogComponent, {
        width: '250px',
        data: {resultString: this.qrResultString}
      });

      dialogRef.afterClosed().subscribe(result => {
        this.hasCameras = true;
      });
  }

  onDeviceSelectChange(changed: MatSelectChange) {
      this.selectedDevice = this.scanner.getDeviceById(changed.value);
  }

}
