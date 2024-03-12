import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Hospital } from '../_models/Hospital';
import { GeneralService } from '../_services/general.service';
import { HospitalService } from '../_services/hospital.service';
import { Router } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-editHospital',
  templateUrl: './editHospital.component.html',
  styleUrls: ['./editHospital.component.css']
})
export class EditHospitalComponent implements OnInit {
  @Input() selectedHospital: Hospital;
  @Input() country: string;
  @Input() contactName: string;
  @Output() hospitalOut: EventEmitter<Hospital> = new EventEmitter();
  @Output() back: EventEmitter<number> = new EventEmitter();
  currentVendor = '';
  contactNumber = 0;
  currentVendorCode = 0;
  cc = 0;
  users:Array<User> = [];


  constructor(private gen: GeneralService,
    private alertify: AlertifyService,
    private auth: AuthService,
    private hosService: HospitalService,
    private router: Router, 
    private user: UserService) { }

  ngOnInit(): void {
    
    let rep: User;
    this.user.getUser(this.auth.decodedToken.nameid).subscribe((next) => {
      rep = next;
      this.currentVendor = rep.vendorName;
      this.currentVendorCode = rep.vendorCode;
    });
    this.user.getUserIdFromName(this.selectedHospital.Contact).subscribe((next) => {
      this.user.getUser(next).subscribe((res) => {
        this.contactNumber = res.userId;
      })
    })
  }

  changingContact(){if(this.cc === 1){return true;} else {return false;}}

  deleteVendorInHospital(id: string) {
    debugger;
   this.hosService.removeVendor(this.currentVendorCode.toString(),id).subscribe((next) => {
    this.back.emit(+id);
    });
  }

  updateHospitalDetails() { this.hospitalOut.emit(this.selectedHospital); }

  goBack() { this.back.emit(1); }

  changeContact(){
    this.cc = 1;
    debugger;
    this.user.getListOfUsersInHospital(1,+this.selectedHospital.HospitalNo,1,10).subscribe(
      (next)=>{this.users = next.result})
  }

  selectContact(id: number){
    this.user.getUser(id).subscribe((next) => {
      const selectedUser = next;
      this.selectedHospital.Contact_image = selectedUser.photoUrl;
      this.selectedHospital.Contact = selectedUser.username;
      this.selectedHospital.email = selectedUser.email;
      this.cc = 0;
    });
  }
}

