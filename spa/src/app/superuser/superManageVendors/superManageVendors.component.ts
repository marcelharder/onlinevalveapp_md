import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { Vendor } from 'src/app/_models/Vendor';
import { DropItem } from 'src/app/_models/dropItem';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { HospitalService } from 'src/app/_services/hospital.service';
import { VendorService } from 'src/app/_services/vendor.service';

@Component({
  selector: 'app-superManageVendors',
  templateUrl: './superManageVendors.component.html',
  styleUrls: ['./superManageVendors.component.css']
})
export class SuperManageVendorsComponent implements OnInit {
  
  @Input() allVendors: DropItem[];
  @Input() inHospitalVendors: string[];
  @Output() backTo: EventEmitter<string> = new EventEmitter<string>();
  @Output() cancelTo: EventEmitter<string> = new EventEmitter<string>();
  
  allvendors: DropItem[];
  vendorsInHospital: string[];
  vendorDetails: Vendor = {
    "id": 0,
    "no": 0,
    "description": "0",
    "contact": null,
    "address": "0",
    "email": "0",
    "telephone": null,
    "fax": null,
    "database_no": "0",
    "spare2": "0",
    "active": null,
    "spare4": "0",
    "reps": ""
  };
  details = 0;

  constructor(
    private vendorService: VendorService,
    private hospitalService: HospitalService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    
    
  }

 

  saveVendorsInHospital(){  // this.vendorsInHospital gives array like so 1,2,3,8
    /* let descriptionarray: number[] = [];
    for (var x=0; x < this.vendorsInHospital.length; x++){
     descriptionarray.push(this.findValueFromDescription(this.vendorsInHospital[x]));  
    }
    this.hospitalService.addVendor(descriptionarray.toString()).subscribe((next)=>{
      this.backTo.emit("1");
    }); */
  }

  displayDetails() { if (this.details == 1) { return true; } }

  moveToHospital(description: string) {
    var index = this.vendorsInHospital.indexOf(description);
    if (index == -1) {
      this.vendorsInHospital.push(description);
      //this.backTo.emit(this.vendors.toString());
    }
    else { this.alertify.message("Vendor is already in hospital") }
  }

  deleteVendor() {
    var index = this.vendorsInHospital.indexOf(this.vendorDetails.description);
    if (index !== -1) {
      this.vendorsInHospital.splice(index, 1);
     // this.backTo.emit(this.vendors.toString());
    }
  }

  cancel() {this.details = 0;}

  showDetails(vendorName: string) {
    this.vendorService.getVendorByName(vendorName).subscribe((next) => {
      this.vendorDetails = next;
      // show details page
      this.details = 1;
    }, (error) => { this.alertify.error(error); })
  }

  /* findValueFromDescription(id: string){
    var selectedItem = this.allvendors.find(x => x.description == id);
    return selectedItem.value;
  
  
  } */
}

