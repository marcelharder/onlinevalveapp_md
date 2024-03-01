import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Valve } from '../_models/Valve';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { EmailMessage } from '../_models/EmailMessage';
import { VendorService } from '../_services/vendor.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit {
@Input() valve: Valve;
@Output() valveBack = new EventEmitter<Valve>();
message: EmailMessage = {
  Id: 0,
  senderId: 0,
  senderKnownAs: '',
  senderPhotoUrl: '',
  recipientId: 0,
  recipientKnownAs: '',
  recipientPhotoUrl: '',
  content: '',
  isRead: false,
  dateRead: new Date(),
  messageSent: new Date(),
};

  constructor(
    public auth: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private vendorService: VendorService) { }

  ngOnInit() {

    this.message.senderId = +this.auth.decodedToken.nameid;

    this.vendorService.getVendor(this.valve.vendor_code).subscribe((r) => {
      this.message.recipientId = +r.spare4; // spare 4 houses the user id that is the contact for this company
      this.message.recipientKnownAs = r.spare2; // spare 2 houses the user name that is the contact for this company

      const messageContext = 'Dear ' + this.message.recipientKnownAs +
      ' today we implanted a ' + this.valve.description +
      ' with serial number: ' + this.valve.serial_no +
      ' can you please provide us with a replacement.'
      this.message.content = messageContext ;
     }, (error) => {console.log(error); });




  }

  send() { this.userService.sendMessage(+this.auth.decodedToken.nameid, this.message).subscribe((next) => {
    this.valveBack.emit(this.valve);
  }, (error) => {console.log(error); }
  ); }

  cancel() {this.valveBack.emit(this.valve); }

}
