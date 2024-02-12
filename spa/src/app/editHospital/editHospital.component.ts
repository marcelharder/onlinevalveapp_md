import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Hospital } from '../_models/Hospital';
import { GeneralService } from '../_services/general.service';
import { HospitalService } from '../_services/hospital.service';
import { Router } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-editHospital',
  templateUrl: './editHospital.component.html',
  styleUrls: ['./editHospital.component.css']
})
export class EditHospitalComponent implements OnInit  {
@Input() selectedHospital: Hospital;
@Input() country: string;
@Input() contactName: string;
@Output() hospitalOut: EventEmitter<Hospital> = new EventEmitter();
@Output() back: EventEmitter<number> = new EventEmitter();
currentVendor = '';
contactNumber = 0;


  constructor(private gen: GeneralService,
              private auth: AuthService,
              private hosService: HospitalService,
              private router: Router, private user: UserService) { }

  ngOnInit(): void {
    let rep: User;
    this.user.getUser(this.auth.decodedToken.nameid).subscribe((next) => {
        rep = next; 
        this.contactNumber = rep.userId;
        this.currentVendor = rep.vendorName;
        });
  }

  deleteVendorInHospital() {
    this.hosService.removeVendor(this.currentVendor).subscribe((next) => {
      this.back.emit(1);
    });
  }

  updateHospitalDetails() {  this.hospitalOut.emit(this.selectedHospital); }

  goBack(){this.back.emit(1);}
}

