import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { GeneralService } from 'src/app/_services/general.service';
import { HospitalService } from 'src/app/_services/hospital.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  hos: Partial<Hospital> = { };
  HospitalName = "";
  title = "Vendors";
  CardCaption = "List of Vendors in this hospital";
  contacts = 0;
  vendors = 1;
  constructor(
    private hosService: HospitalService,
    private gen: GeneralService, 
    private auth: AuthService, 
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.hosService.getDetails().subscribe((next)=>{
      debugger;
      this.HospitalName = next.SelectedHospitalName;
      this.hos = next;
    })

    

  }

  displayVendors() { if (this.vendors === 1) { return true; } }
  displayContacts() { if (this.contacts === 1) { return true; } }

  showVendors() {
    this.title = "Vendors";
    this.CardCaption = "List of Vendors in this hospital";
    this.vendors = 1; this.contacts = 0;
  }
  manageContact() {
    this.title = "Contacts";
    this.CardCaption = "Select the hospital contact person from the list";
    this.vendors = 0; this.contacts = 1;
  }

    

  getVendorList(): string[]{
    var help:string[]=[];
    if(this.hos.vendors !== undefined){
    return this.hos.vendors.split(',');}
    return help;
  }
  returnFromVendor(description: string){
    debugger;
    this.hos.vendors = description;
    this.hosService.saveVendorsToHospital(this.hos.HospitalNo, this.hos.vendors).subscribe((next)=>{
      this.vendors = 0;
    });
    
  }
  cancelFromVendor(up: string){this.title = "Vendors"; }
  cancelFromContact(up: string){this.vendors = 1; this.contacts = 0;this.title = "Vendors";}

  returnFromContact(up: string){
  // save the hospitalwith the new contact
  this.hosService.saveContactToHospital(this.hos.HospitalNo, up).subscribe((next)=>{
    this.vendors = 1; this.contacts = 0;
  }, (error)=>{this.alertify.error(error)});
  }

}


