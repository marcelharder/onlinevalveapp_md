import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/_models/pagination';
import { Vendor } from 'src/app/_models/Vendor';
import { VendorService } from 'src/app/_services/vendor.service';

@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.css']
})
export class ListVendorsComponent implements OnInit {

  listOfVendors: Array<Vendor> = [];
  pagination: Pagination;
  vendorDetails:Vendor = {Id: 0,No:0,description: "",contact: "",address: "",email: "",telephone: "",fax: "",database_no: "",spare2: "",active: "",spare4: ""};
  details = 0;

  constructor(private route: ActivatedRoute, private vendorService:VendorService) { }

  ngOnInit() {
    this.route.data.subscribe((data) => { 
      debugger;
      this.pagination = data.vendors.pagination;
      this.listOfVendors = data.vendors.result; })
  }

  displayDetails(){if(this.details === 1){return true;}}

  returnFromEditDetails(test: string){if(test === "1"){this.details = 0;}}

  showDetails(id: string){
    // get details of this valve type
    this.vendorService.getVendor(+id).subscribe((next)=>{
      this.vendorDetails = next});
      this.details = 1;
   }

}
