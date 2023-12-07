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
  @Input() selectedHospital: Hospital;
  @Input() vendors: string[];
  @Output() backTo: EventEmitter<string> = new EventEmitter<string>();
  @Output() cancelTo: EventEmitter<string> = new EventEmitter<string>();
  allvendors: DropItem[];
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
    // getAllVendors
    this.vendorService.getVendors().subscribe((next) => {
      this.allvendors = next;
    })
  }

  displayDetails() { if (this.details == 1) { return true; } }

  moveToHospital(description: string) {
    var index = this.vendors.indexOf(description);
    if (index == -1) {
      this.vendors.push(description);
      this.backTo.emit(this.vendors.toString());
    }
    else { this.alertify.message("Vendor is already in hospital") }
  }

  deleteVendor() {
    var index = this.vendors.indexOf(this.vendorDetails.description);
    if (index !== -1) {
      this.vendors.splice(index, 1);
      this.backTo.emit(this.vendors.toString());
    }
  }

  cancel() {this.cancelTo.emit("1");}

  showDetails(vendorName: string) {
    this.vendorService.getVendorByName(vendorName).subscribe((next) => {
      this.vendorDetails = next;
      // show details page
      this.details = 1;
    }, (error) => { this.alertify.error(error); })
  }
}

