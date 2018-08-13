import { Component } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  readonly VAPID_PUBLIC_KEY = 'BPHGp-49DAF9-dTgo3G-MF2-ukiWhBn0wsOlX86nfi26Qa5ysrPc7wQH_RVp9MmcXfZjpM2fpZPAIi3XmFJe9X8';
  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private snackBar: MatSnackBar,
    private notifyService: NotificationService,
  ) {
    // To enable automatically updates
    // Ref: https://angular.io/guide/service-worker-communications#forcing-update-activation
    swUpdate.available.subscribe(event => {
      swUpdate.activateUpdate().then(() => document.location.reload());
    });

    // Asking for push notification permission
    this.subscribeToNotifications();

    // Event to show network status
    window.addEventListener('load', () => {
      const updateOnlineStatus = (event) => {
        const message = navigator.onLine
          ? 'Yay! Your\'e Online' : 'Opps! Your\'e Offline';
        this.snackBar.open(
          message,
          'Dismiss',
          { duration: 3000} // dismiss snack bar after 3 sec
        );
      };

      window.addEventListener('online',  updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
    });
  }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then((sub) => {
      console.log(sub);
      this.notifyService.saveSubscription(sub);
    })
    .catch((err) => console.error('Could not subscribe to notifications', err));
  }
}
