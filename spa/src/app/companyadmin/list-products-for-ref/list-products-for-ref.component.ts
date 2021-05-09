import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { GeneralService } from 'src/app/_services/general.service';
import { User } from 'src/app/_models/User';
import { ProductService } from 'src/app/_services/product.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { VendorService } from 'src/app/_services/vendor.service';

@Component({
  selector: 'app-prod-types',
  templateUrl: './list-products-for-ref.component.html',
  styleUrls: ['./list-products-for-ref.component.css']
})
export class ListProductsForRefComponent implements OnInit {
  @Input() prod: TypeOfValve;
  selectedProduct: TypeOfValve;
  newProduct: TypeOfValve;
  currentCountry = '';
  detailsPage = 0;
  addPage = 0;
  listPage = 0;

  constructor(private auth: AuthService,
              private alertify: AlertifyService,
              private user: UserService,
              private ven: VendorService,
              private gen: GeneralService,
              private prodService: ProductService) { }

  ngOnInit(): void {
    this.listPage = 1;
    let rep: User;
    this.user.getUser(this.auth.decodedToken.nameid).subscribe((next) => {
      rep = next;
      this.currentCountry = next.country;

      // tslint:disable-next-line:no-shadowed-variable
      //this.gen.getCountryName(rep.country).subscribe((next) => {  this.currentCountry = next; });
    });
  }

  changeViewBackToList(id: number) {
    // this comes from the edit or add component, when it wants to close itself
    this.detailsPage = 0;
    this.addPage = 0;
    this.listPage = 1;
  }


  addProduct() {
    this.alertify.confirm('Are you sure ?', () => {
      this.prodService.addProduct().subscribe((next) => {
        this.newProduct = next;
        this.addPage = 1;
        this.detailsPage = 0;
        this.listPage = 0;
      });
    });
  }



  showDetails(id: number) {
    this.prodService.getProductById(id).subscribe((next) => {  this.selectedProduct = next; });
    this.detailsPage = 1;
    this.addPage = 0;
    this.listPage = 0;
  }

  displayDetails() { if (this.detailsPage === 1) { return true; } }
  displayAddDetails() { if (this.addPage === 1) { return true; } }
  displayList() {if (this.listPage === 1) { return true; }}




}
