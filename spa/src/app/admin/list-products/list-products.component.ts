import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DropItem } from 'src/app/_models/dropItem';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { Vendor } from 'src/app/_models/Vendor';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ProductService } from 'src/app/_services/product.service';
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
  details = 0;
  productDetails: TypeOfValve;

  constructor(private route: ActivatedRoute,
    private vendorService: VendorService,
    private prod: ProductService,
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
    
  }

  showDetails(id: string){
    // get details of this valve type
    this.prod.getProductById(+id).subscribe((next)=>{
      this.productDetails = next});
      this.details = 1;
   }

  displayDetails(){if(this.details === 1){return true;}}

  returnFromEditDetails(test: string){if(test === "1"){this.details = 0;}}

}
