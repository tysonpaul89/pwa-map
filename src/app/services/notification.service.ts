import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  url = 'https://us-central1-maps-back.cloudfunctions.net/app';
  subscriptionId: string;
  constructor(
    private http: HttpClient,
  ) { }

  saveSubscription(subscription: object) {
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type':  'application/json',
      }),
    };

    this.http.post(
      this.url + '/save-subscription',
      subscription,
      httpOptions
    ).subscribe((res: any) => {
      console.log(res);
      this.subscriptionId = res.subscriptionId;
    });
  }

  sendNotification() {
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type':  'application/json',
      }),
    };

    console.log('req body', {
      subscriptionId: this.subscriptionId, message: 'Hello'
    });
    return this.http.post(
      this.url + '/send-notification',
      {subscriptionId: this.subscriptionId, message: 'Hello'},
      httpOptions
    );
  }
}
