import { MatSnackBar } from '@angular/material';
import { Component, OnInit, isDevMode } from '@angular/core';
import { NotificationService } from '../services/notification.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private notifyService: NotificationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  sendNotification(message) {
    if (!isDevMode()) {
      if (navigator.onLine) {
        this.notifyService.sendNotification(message).subscribe(
          (res) => {
            console.log('res', res);
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.snackBar.open(
          'Oops! Notifications will not work when your\'e </b>offline<b>',
          'Dismiss',
          { duration: 3000} // dismiss snack bar after 3 sec
        );
      }
    } else {
      console.warn('Notification Functionality is only available in production');
    }
  }

  vibrateDevice(ms: number) {
    navigator.vibrate(ms);
  }

}
