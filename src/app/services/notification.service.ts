import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  url = 'https://us-central1-maps-back.cloudfunctions.net/app';
  subscription: object;
  constructor(
    private http: HttpClient,
  ) { }

  saveSubscription(subscription: object) {
    this.subscription = subscription;
  }

  sendNotification(message) {
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type':  'application/json',
      }),
    };

    const body = {subscription: this.subscription, message};
    console.log('req body', body);
    return this.http.post(
      this.url + '/send-notification',
      body,
      httpOptions
    );
  }
}
