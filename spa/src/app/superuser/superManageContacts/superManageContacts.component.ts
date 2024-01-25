import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { User } from 'src/app/_models/User';
import { PaginatedResult } from 'src/app/_models/pagination';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { HospitalService } from 'src/app/_services/hospital.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-superManageContacts',
  templateUrl: './superManageContacts.component.html',
  styleUrls: ['./superManageContacts.component.css']
})
export class SuperManageContactsComponent implements OnInit {
  
  @Input() selectedHospital: Hospital;
  @Output() backTo: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() cancelTo: EventEmitter<string> = new EventEmitter<string>();
  availableUsers: User[];
  current_contact_username = "";
  current_contact_image = "";
  
 


  constructor(
    private alertify: AlertifyService, 
    private hosservice: HospitalService,
    private userService: UserService) { }

  ngOnInit() {
    // get username from contact
    this.userService.getUser(+this.selectedHospital.contact).subscribe((next) => {
      this.current_contact_username = next.username;
      this.current_contact_image = next.photoUrl;
    });

    // get contacts for this hospital
    this.userService.getListOfUsersInHospital(0, +this.selectedHospital.HospitalNo, 1, 20).subscribe((next) => {
      this.availableUsers = next.result;
    });
  }
  ContactTitle() { return "Hier komt de contact page title"; }

  Cancel(){this.cancelTo.emit("1")}

  Save(){
  this.hosservice.saveContactToHospital(this.current_contact_username,this.current_contact_image)
  .subscribe(()=>{this.cancelTo.emit("1")},error => {this.alertify.error(error)})
  }

  makeCurrentContact(p: User) {
    var help = 0;
    this.selectedHospital.contact = p.username;
    this.selectedHospital.contact_image = p.photoUrl;
  }



}
