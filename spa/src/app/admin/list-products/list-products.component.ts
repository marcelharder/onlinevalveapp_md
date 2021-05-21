import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DropItem } from 'src/app/_models/dropItem';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { Vendor } from 'src/app/_models/Vendor';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { VendorService } from 'src/app/_services/vendor.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  listOfProducts:Array<TypeOfValve> = [];
  listOfVendors:Array<DropItem> =[];
  selectedVendor = 0;

  constructor(private route: ActivatedRoute,
    private vendorService: VendorService,
    private alertify: AlertifyService,
    private authService: AuthService) { }

  ngOnInit() {

    this.vendorService.getVendors().subscribe((nxt)=>{this.listOfVendors = nxt;})

    this.route.data.subscribe((data) => { this.listOfProducts = data.products; })
  }

  vendorChanged(){
    // get the products from this vendor
    this.vendorService.getAllFullProducts(this.selectedVendor).subscribe((next)=>{
      this.listOfProducts = next;
    })
    this.alertify.message("blah");
  }

}
