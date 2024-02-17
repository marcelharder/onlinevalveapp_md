import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { Vendor } from 'src/app/_models/Vendor';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { VendorService } from 'src/app/_services/vendor.service';

@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.css']
})
export class ListVendorsComponent implements OnInit {

  listOfVendors: Array<Vendor> = [];
  pagination: Pagination;
  vendorDetails:Vendor = {id: 0,no:0,description: "",
  contact: "",address: "",email: "",telephone: "",fax: "",
  database_no: "",spare2: "",active: "",spare4: "", reps:""};
  details = 0;

  constructor(private route: ActivatedRoute, 
    private vendorService:VendorService, 
    private authService:AuthService, 
    private alertify:AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe((data) => { 
     this.pagination = data.vendors.pagination;
      this.listOfVendors = data.vendors.result; })
  }
  addVendor(){this.vendorService.addVendor().subscribe((next)=>{this.vendorDetails = next;this.details = 1; })}
  loadVendors() {
    this.vendorService.getVendorsFull(this.authService.decodedToken.nameid, this.pagination.currentPage, this.pagination.itemsPerPage)
    .subscribe((res: PaginatedResult<Vendor[]>) => {
      this.listOfVendors = res.result;
      this.pagination = res.pagination;
    }, (error) => { this.alertify.error(error); });
  }
  displayDetails(){if(this.details === 1){return true;}}
  
  returnFromEditDetails(test: string){if(test === "1"){this.details = 0;}}

  showDetails(id: string){
    // get details of this valve type
  this.vendorService.getVendor(id).subscribe((next)=>{
      this.vendorDetails = next});
      this.details = 1;
   }
   pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadVendors();
  }

  


}
