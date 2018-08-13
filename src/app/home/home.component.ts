import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private notifyService: NotificationService
  ) { }

  ngOnInit() {
  }

  sendNotification() {
    console.log('button clicked');
    this.notifyService.sendNotification().subscribe(
      (res) => {
        console.log('res', res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
