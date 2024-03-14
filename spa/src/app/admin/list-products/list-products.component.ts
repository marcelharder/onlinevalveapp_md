import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DropItem } from 'src/app/_models/dropItem';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { valveSize } from 'src/app/_models/valveSize';
import { Vendor } from 'src/app/_models/Vendor';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { GeneralService } from 'src/app/_services/general.service';
import { ProductService } from 'src/app/_services/product.service';
import { VendorService } from 'src/app/_services/vendor.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  listOfProducts: Array<TypeOfValve> = [];
  listOfVendors: Array<DropItem> = [];
  listOfCountries: Array<DropItem> = [];
  listOfSizes: Array<valveSize> = [];
  selectedCountry = "All";
  selectedVendor = 0;
  details = 0;
  productDetails: TypeOfValve;

  constructor(private route: ActivatedRoute,
    private vendorService: VendorService,
    private gen: GeneralService,
    private prod: ProductService,
    private alertify: AlertifyService,
    private authService: AuthService) { }

  ngOnInit() {

    this.vendorService.getVendors().subscribe((nxt) => {
      this.listOfVendors = nxt;
      var h: DropItem = { value: 0, description: "Choose" };
      this.listOfVendors.unshift(h);



    })
    this.gen.getListOfCountries().subscribe((next) => {
      this.listOfCountries = next;
      var h: DropItem = { value: 0, description: "All" };
      this.listOfCountries.unshift(h);
    });
    this.route.data.subscribe((data) => {
      this.listOfProducts = data.products;
    })
  }

  vendorChanged() {
    // get the products from this vendor
    this.vendorService.getAllFullProducts(this.selectedVendor, this.selectedCountry).subscribe((next) => {
      this.listOfProducts = next;
    })

  }

  showDetails(id: string) {
    // get details of this valve type
    this.prod.getProductById(+id).subscribe((next) => {

      this.productDetails = next;
      // get the sizes for this type of valve
      this.prod.getValveSizes(this.productDetails.No).subscribe((next) => {
        this.listOfSizes = next;
        // sort this list on valveSize
        this.listOfSizes.sort((a,b) => (a.Size < b.Size ? -1 : 1))
      });

    });



    this.details = 1;
  }

  displayDetails() { if (this.details === 1) { return true; } }

  returnFromEditDetails(test: string) { if (test === "1") { this.details = 0; } }

}
