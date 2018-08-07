import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar
  ) {
    // To enable automatically updates
    // Ref: https://angular.io/guide/service-worker-communications#forcing-update-activation
    swUpdate.available.subscribe(event => {
      swUpdate.activateUpdate().then(() => document.location.reload());
    });

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
}
