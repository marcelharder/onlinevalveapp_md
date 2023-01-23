import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DropItem } from '../_models/dropItem';
import { Valve } from '../_models/Valve';
import { TypeOfValve } from '../_models/TypeOfValve';
import { Hospital } from '../_models/Hospital';
import { HospitalService } from '../_services/hospital.service';
import { AlertifyService } from '../_services/alertify.service';
import { ValveService } from '../_services/valve.service';
import { AuthService } from '../_services/auth.service';
import { VendorService } from '../_services/vendor.service';
import { GeneralService } from '../_services/general.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/User';

@Component({
  selector: 'app-companyadmin',
  templateUrl: './companyadmin.component.html'
})

export class CompanyadminComponent implements OnInit {
  searchString = '';
  vendorName = '';
  selectedValveDescription = '';
  vendorId = 0;
  selectedProduct = 0;
  selectedHospital = 0;
  succesfulSearchTerm = 0;
  valveFoundInDatabase = 0;
  listValves = 0;
  hospitals = 0;
  products = 0;
  allProducts: DropItem = { value: 99, description: 'All' };

  sp = '';
  goclicked = 0;

  optionsHospitals: Array<DropItem> = [];
  optionsProducts: Array<DropItem> = [];
  valves: Array<Valve> = [];
  FullProducts: Array<TypeOfValve> = [];
  FullHospitals: Array<Hospital> = [];

  constructor(private hos: HospitalService,
    private alertify: AlertifyService,
    private router: Router,
    private valve: ValveService,
    private auth: AuthService,
    private ven: VendorService,
    private gen: GeneralService,
    private user: UserService) {

  }
  ngOnInit(): void {
    let rep: User;
   
    this.user.getUser(this.auth.decodedToken.nameid).subscribe((next) => {
      rep = next;
      this.vendorName = next.vendorName;
      this.ven.getProductByVendor(next.vendorCode).subscribe((nex) => {
        this.optionsProducts = nex;
        this.optionsProducts.unshift(this.allProducts);
        this.sp = this.optionsProducts[0].description;
        this.hos.getListOfHospitalsWhereVendorIsActive().subscribe((ne) => {
          this.optionsHospitals = ne;
          this.selectedHospital = this.optionsHospitals[0].value;
        });
      });


    });


    // NB: options_Products en optionsHospitals are arrays of dropItem
   

  }
  linkToCSD() { window.location.href = 'http://77.173.53.32:8046'; }

  showListOfValves() {// show all valves that meet the criteria
    if (this.listValves === 1) { return true; } else {return false;}
  }
  GoClicked(){
    if (this.goclicked === 1) { return true; } else {return false;}}

  getDescription() {
    const help = 'Add ' + this.selectedValveDescription + ' for this hospital';
    if (this.selectedValveDescription !== 'All') {
      return help;
    } else { return ''; }
  }

  showAddButton() { if (this.sp === 'All') { return false; } else { return true; } }

  addProducts() {
    // update the currentHospital to the behaviorSubject in the authService, so we can use it later
    this.auth.changeCurrentHospital(this.selectedHospital.toString());
    this.alertify.warning('Adding ' + this.sp);
    this.router.navigate(['/addCompanyValve/', this.selectedProduct]);
  }


  findMatchingValves() {
    this.goclicked = 1; // show the results now
    // hide the products and hospitals
    this.hospitals = 0;
    this.products = 0;

    if (this.selectedHospital !== 0 && this.sp !== '') {
      this.selectedValveDescription = this.sp;
      this.selectedProduct = this.optionsProducts.find(x => x.description === this.sp).value;

      this.valve.getValvesByHospitalAndValveCodeId(this.selectedHospital, this.selectedProduct)
        .subscribe((next) => {
          this.valves = next;
          if (next.length > 0) { this.listValves = 1; } else { this.listValves = 0; }

        }, (error) => {
          this.alertify.warning(error);
          this.listValves = 0;
        });
    }
  }
}
