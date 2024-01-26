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
  
  
  constructor(
    private alertify: AlertifyService, 
    private hosservice: HospitalService,
    private userService: UserService) { }

  ngOnInit() {
    this.selectedHospital.Contact_image = decodeURIComponent(this.selectedHospital.Contact_image);
    this.userService.getListOfUsersInHospital(0, +this.selectedHospital.HospitalNo, 1, 20).subscribe((next) => {
      this.availableUsers = next.result;
    });
  }
  ContactTitle() { return "Hier komt de contact page title"; }

  Cancel(){this.cancelTo.emit("1")}

  Save(){
  this.hosservice.saveContactToHospital(this.selectedHospital.Contact,this.selectedHospital.Contact_image)
  .subscribe(()=>{this.cancelTo.emit("1")},error => {this.alertify.error(error)})
  }

  makeCurrentContact(p: User) {
    var help = 0;
    this.selectedHospital.Contact = p.username;
    this.selectedHospital.Contact_image = p.photoUrl;
  }



}
