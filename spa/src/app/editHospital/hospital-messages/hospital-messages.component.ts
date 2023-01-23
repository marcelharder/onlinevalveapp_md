import { Component, OnChanges, Input } from '@angular/core';
import { EmailMessage } from '../../_models/EmailMessage';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';
import { AuthService } from '../../_services/auth.service';
import * as _ from 'underscore';
import { tap } from 'rxjs/operators'; 

@Component({
  selector: 'app-hospital-messages',
  templateUrl: './hospital-messages.component.html',
  styleUrls: ['./hospital-messages.component.css']
})
export class HospitalMessagesComponent implements OnChanges {
  @Input() recipientId: number;
  messages: EmailMessage[];
  newMessage: any = {};


  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private authService: AuthService
  ) { }

  ngOnChanges() { this.loadMessages(); }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(currentUserId, this.recipientId)
      .pipe(
        tap(messages => {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < messages.length; i++) {
            if (messages[i].isRead === false && messages[i].recipientId === currentUserId) {
              this.userService.markAsRead(currentUserId, messages[i].Id);
            }
          }
        })
      )
      .subscribe((messages) => {
        this.messages = messages;
      }, (error) => { this.alertify.error(error); });
  }
  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe((message: EmailMessage) => {
      this.messages.unshift(message);
      this.newMessage.content = '';
    }, error => { this.alertify.error(error); })

  }


}
