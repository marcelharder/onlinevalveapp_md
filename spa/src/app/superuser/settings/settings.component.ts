import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { DropItem } from 'src/app/_models/dropItem';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { GeneralService } from 'src/app/_services/general.service';
import { HospitalService } from 'src/app/_services/hospital.service';
import { VendorService } from 'src/app/_services/vendor.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterContentInit {
  hos: Partial<Hospital> = { };
  allVendors:DropItem[]=[];
  ihVendors:string[]=[];
  HospitalName = "";
  title = "Vendors";
  CardCaption = "List of Vendors in this hospital";
  contacts = 0;
  vendors = 0;
  constructor(
    private hosService: HospitalService,
    private gen: GeneralService, 
    private vendorService: VendorService,
    private auth: AuthService, 
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.hosService.getDetails().subscribe((next)=>{
      this.hos = next;
      this.HospitalName = next.SelectedHospitalName;
      this.vendorService.getVendors().subscribe((next) => { 
        this.allVendors = next;
        this.ihVendors = this.getVendorList();
      });
    },(error)=>{this.alertify.error(error)
    },()=>{ })
   

  }

  ngAfterContentInit(){ this.vendors = 1; }

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

    

  
  returnFromVendor(description: string){
    this.alertify.message("uploaded ...");
    //this.vendors = 0;
  }
  
  cancelFromVendor(up: string){this.title = "Vendors"; }
  
  cancelFromContact(up: string){this.vendors = 1; this.contacts = 0;this.title = "Vendors";}

  returnFromContact(up: string[]){
  // save the hospitalwith the new contact
  this.hosService.saveContactToHospital(up[0], up[1]).subscribe((next)=>{
    this.vendors = 1; this.contacts = 0;
  }, (error)=>{this.alertify.error(error)});
  }

    getVendorList(): string[]{
    var help:string[]=[];
    var naamStringArray: string[]=[];
    if(this.hos.Vendors !== undefined){
      help = this.hos.Vendors.split(',');
      help = help.filter(a => a!="");
      for(var x=0;x<help.length;x++)
      {
        naamStringArray.push(this.allVendors.find(a => a.value === +help[x]).description);
      }
    }
    
    return naamStringArray;
  } 

}


