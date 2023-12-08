import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { User } from 'src/app/_models/User';
import { PaginatedResult } from 'src/app/_models/pagination';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-superManageContacts',
  templateUrl: './superManageContacts.component.html',
  styleUrls: ['./superManageContacts.component.css']
})
export class SuperManageContactsComponent implements OnInit {
  @Input() selectedHospital: Hospital;
  @Output() backTo: EventEmitter<string> = new EventEmitter<string>();
  @Output() cancelTo: EventEmitter<string> = new EventEmitter<string>();
  availableUsers: User[];
  current_contact_username = "";
  current_contact_image = "";


  constructor(private alertify: AlertifyService, private userService: UserService) { }

  ngOnInit() {
    // get username from contact
    this.userService.getUser(+this.selectedHospital.contact).subscribe((next) => {
      this.current_contact_username = next.username;
      this.current_contact_image = next.photoUrl;
    });

    // get contacts for this hospital

    this.userService.getListOfUsersInHospital(0, this.selectedHospital.hospitalNo, 1, 20).subscribe((next) => {
      this.availableUsers = next.result;
    });
  }
  ContactTitle() { return "Hier komt de contact page title"; }

  Cancel(){this.cancelTo.emit("1")}

  makeCurrentContact(p: User) {
    var help = 0;
    this.userService.getUserIdFromName(p.username).subscribe((next) => {
      help = next;
      this.selectedHospital.contact = help.toString();
      this.selectedHospital.contact_image = p.photoUrl;
      this.backTo.emit("1");
    },(error)=>{this.alertify.error(error)});
   

  }



}
