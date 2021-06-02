import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { from } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { DropItem } from 'src/app/_models/dropItem';
import { modelValveParams } from 'src/app/_models/modelValveParams';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { Valve } from 'src/app/_models/Valve';
import { valveSize } from 'src/app/_models/valveSize';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { DropService } from 'src/app/_services/drop.service';
import { HospitalService } from 'src/app/_services/hospital.service';
import { ProductService } from 'src/app/_services/product.service';
import { ValveService } from 'src/app/_services/valve.service';

@Component({
  selector: 'app-selectValve',
  templateUrl: './selectValve.component.html',
  styleUrls: ['./selectValve.component.css']
})
export class SelectValveComponent implements OnInit {

  pagination: Pagination;
  Title = "";

  showA = '0';
  bsa = 0.0;
  requestedDiameter = 0;


  sizesOptions: Array<DropItem> = [];
  heightOptions: Array<DropItem> = [];
  weightOptions: Array<DropItem> = [];
  ageOptions: Array<DropItem> = [];
  genderOptions: Array<DropItem> = [];
  optionsPositions: Array<DropItem> = [];
  optionsPos: Array<DropItem> = [];
  optionsType: Array<DropItem> = [];
  optionsVendor: Array<DropItem> = [];

  valveSizes:Array<valveSize> = [];

  selectedHeight = 0;
  selectedAge = 0;
  selectedGender = 0;
  selectedWeight = 0;
  selectedSize = 0;
  lifeStyle = true;
  preference = true;
  selectedPosition = 0;
  selectedPos = '';
  selectedType = '';
  selectedVendor = 0;
  messagePPM = "";
  moderatePPM = 0;
  severePPM = 0;

  showAo = 0;
  showM = 0;
  showOVI = 0;
  aorticvalves: Array<Valve> = [];
  mitralvalves: Array<Valve> = [];
  products: Array<TypeOfValve> = [];
  productRequested = "";
  AproductRequested = "";
  MproductRequested = "";
  HospitalName = "";
  ImagePath = "";
  showProduct = 0;
  showBSA = 0;

  valveParams: modelValveParams = {
    BioPref: 0,
    Size: 0, // NB this is the measured Size
    Soort: 0,
    Position: "",
    Height: 0,
    Weight: 0,
    Age: 0,
    LifeStyle: 0

  };

  product: TypeOfValve = {
    valveTypeId: 0,
    no: 0,
    uk_code: '',
    us_code: '',
    description: '',
    valve_size: [],
    type: '',
    image: '',
    vendor_description: '',
    vendor_code: '',
    model_code: '',
    implant_position: '',
    countries: ''
};

  constructor(private alertify: AlertifyService,
    private prod: ProductService,
    private drops: DropService,
    private vs: ValveService,
    private auth: AuthService,
    private hs: HospitalService) { }

  ngOnInit() {
    this.selectedPos = "Aortic";
    this.auth.currentHospital.subscribe((next) => {

      this.HospitalName = next;
      // find out if this hospital is enrolled in the OVI program
      this.hs.isOVIPlace().subscribe((next) => { if (next === 1) { this.showOVI = 1; } })


    });

    this.ImagePath = 'https://res.cloudinary.com/marcelcloud/image/upload/v1620571880/valves/valves02.jpg';

    this.loadDrops();

  }

  OVIPlace() {
    if (this.showOVI === 1) {
      this.Title = "Fit a valve for your patient, select from valves in your hospital";
      return true;
    } else { this.Title = "Select the valve first"; return false; }
  }

  Search() {
    if (this.selectedVendor !== 0 && this.selectedType !== '') {

      this.prod.getProductsByVTP(this.selectedVendor, this.selectedType, "Aortic").subscribe((next) => {
        this.products = next;
        if (this.products.length === 0) {
          this.alertify.warning("Nothing found ...");
        } else { this.alertify.message("Found these valve types ..."); }
      })
    }
    else {
      if (this.selectedVendor === 0 && this.selectedType === '') { this.alertify.error("Please select a vendor and position") }
      else {
        if (this.selectedType === '') { this.alertify.error("Please select implant position") }
        if (this.selectedVendor === 0) { this.alertify.error("Please select a vendor first ...") }
      }
    }
  }

  SearchDetails(id: number) {
 
    this.prod.getProductById(id).subscribe(
      (next)=>{ 
      this.product = next;
      var bsa = this.calculateBSA(this.selectedHeight, this.selectedWeight);
           this.valveSizes = this.product.valve_size;
           debugger;
           this.valveSizes.forEach(element => {
            if ((element.eoa/bsa) > .85) { element.ppm = 'none' } else {
              if ((element.eoa/bsa) <= .85 && (element.eoa/bsa) >= .65) { element.ppm = "moderate" }
              else {
                if ((element.eoa/bsa) < .65) { element.ppm = "severe" }
              }
            }
          });

      }, 
      (error)=>{this.alertify.error(error)}, 
      ()=>{this.showProduct = 1;})
  }


  findPossibleValves() {
    if (this.selectedPosition.toString() === "1") {
      // make sure that the height and weight are filled
      if (this.selectedHeight != 0 && this.selectedWeight != 0) {
        if (this.selectedSize != 0) { this.loadAoValves(); }
        // make sure that the size filled
        else { this.alertify.error("Please enter valve size ..."); }
      } else {
        this.alertify.error("Please enter height and weight first ...");
      }
    };
    if (this.selectedPosition.toString() === "2") {
      if (this.selectedSize != 0) { this.loadMValves(); }
      // make sure that the size filled
      else { this.alertify.error("Please enter valve size ..."); }
    };
    if (this.selectedPosition.toString() === "3") {
      if (this.selectedHeight != 0 && this.selectedWeight != 0) {
        if (this.selectedSize != 0) { this.loadAoValves(); }
        // make sure that the size filled
        else { this.alertify.error("Please enter valve size ..."); }
      } else {
        this.alertify.error("Please enter height and weight first ...");
      }

      if (this.selectedSize != 0) { this.loadMValves(); }
      // make sure that the size filled
      else { this.alertify.error("Please enter valve size ..."); }
    };

  }

  onPositionChange() {
    if (this.selectedPosition.toString() === '0') { this.showAo = 0; this.showM = 0; this.AproductRequested = ""; this.MproductRequested = ""; }
    if (this.selectedPosition.toString() === '1') { this.showAo = 1; this.showM = 0; this.AproductRequested = "Aortic  valves"; this.MproductRequested = ""; }
    if (this.selectedPosition.toString() === '2') { this.showAo = 0; this.showM = 1; this.MproductRequested = "Mitral valves"; this.AproductRequested = ""; }
    if (this.selectedPosition.toString() === '3') { this.showAo = 1; this.showM = 1; this.AproductRequested = "Aortic  valves"; this.MproductRequested = "Mitral valves"; }
  }

  

  showAoValves() { if (this.showAo === 1) { return true; } }
  showMValves() { if (this.showM === 1) { return true; } }
  showPlaatje() { if (this.showAo !== 1 && this.showM !== 1) { return true; } }
  showSeverePPM() { if (this.severePPM === 1) { return true; } }
  showModeratePPM() { if (this.moderatePPM === 1) { return true; } }
  showAdvice() { if (this.showA === '1') { return true; } }
  showProductDetails(){if (this.showProduct === 1) { return true; } }

  

  noBSA(){if (this.showBSA === 1) { return true; }}
  

  severePPMCCS(inp: string) { if (inp === 'severe') { return true } }
  nonePPMCCS(inp: string) { if (inp === 'none') { return true } }
  moderatePPMCCS(inp: string) { if (inp === 'moderate') { return true } }

  loadAoValves() {

    if (this.preference) { this.valveParams.BioPref = 1; } else { this.valveParams.BioPref = 0; }
    if (this.lifeStyle) { this.valveParams.LifeStyle = 1; } else { this.valveParams.LifeStyle = 0; }
    this.valveParams.Size = this.selectedSize;
    this.valveParams.Position = "Aortic";
    this.valveParams.Height = this.selectedHeight;
    this.valveParams.Weight = this.selectedWeight;

    this.vs.getSuggestedValves(this.auth.decodedToken.nameid, this.valveParams, 1, 10).subscribe((next: PaginatedResult<Valve[]>) => {
      this.aorticvalves = next.result;
      this.pagination = next.pagination;

      if (this.aorticvalves.length === 0) {
        this.AproductRequested = "No aortic valves are available for implant in " + this.HospitalName;
      } else {
        //this.aorticvalves =  this.aorticvalves.filter(valve => {valve.tfd < .65}); // filter the severe ppm's
        this.aorticvalves.forEach(element => {
          if (element.tfd > .85) { element.ppm = 'none' } else {
            if (element.tfd <= .85 && element.tfd >= .65) { element.ppm = "moderate" }
            else {
              if (element.tfd < .65) { element.ppm = "severe" }
            }
          }
        });
        this.AproductRequested = "These aortic valves are available for implant in " + this.HospitalName;
      }
    }, (error) => { this.alertify.error(error); })
  }


  loadMValves() {
    if (this.preference) { this.valveParams.BioPref = 1; } else { this.valveParams.BioPref = 0; }
    if (this.lifeStyle) { this.valveParams.LifeStyle = 1; } else { this.valveParams.LifeStyle = 0; }
    this.valveParams.Size = this.selectedSize;
    this.valveParams.Position = "Mitral";
    this.valveParams.Height = this.selectedHeight;
    this.valveParams.Weight = this.selectedWeight;

    this.vs.getSuggestedValves(this.auth.decodedToken.nameid, this.valveParams, 1, 10).subscribe((next: PaginatedResult<Valve[]>) => {
      this.mitralvalves = next.result;
      if (this.mitralvalves.length === 0) {
        this.MproductRequested = "No mitral valves are available for implant in " + this.HospitalName;
      } else {
        this.MproductRequested = "These mitral valves are available for implant in " + this.HospitalName;
      }
      this.pagination = next.pagination;

    }, (error) => { this.alertify.error(error); })
  }

  loadDrops() {
    this.optionsPositions.push({ value: 0, description: "Choose" });
    this.optionsPositions.push({ value: 1, description: "Aortic" });
    this.optionsPositions.push({ value: 2, description: "Mitral" });
    this.optionsPositions.push({ value: 3, description: "Aortic and Mitral" });

    this.optionsType.push({ value: 0, description: "Biological" });
    this.optionsType.push({ value: 1, description: "Mechanical" });

    this.genderOptions.push({ value: 0, description: "Choose" });
    this.genderOptions.push({ value: 1, description: "Male" });
    this.genderOptions.push({ value: 2, description: "Female" });

    this.optionsPos.push({ value: 1, description: "Aortic" });
    this.optionsPos.push({ value: 2, description: "Mitral" });

    var i = 0;
    this.sizesOptions.push({ value: 0, description: "Choose" });
    for (i = 16; i < 35; i++) { this.sizesOptions.push({ value: i, description: i.toString() }); }

    this.ageOptions.push({ value: 0, description: "Choose" });
    for (i = 18; i < 90; i++) { this.ageOptions.push({ value: i, description: i.toString() }); }

    this.weightOptions.push({ value: 0, description: "Choose" });
    for (i = 45; i < 160; i++) { this.weightOptions.push({ value: i, description: i.toString() }); }

    this.heightOptions.push({ value: 0, description: "Choose" });
    for (i = 150; i < 210; i++) { this.heightOptions.push({ value: i, description: i.toString() }); }

    this.drops.getCompanyOptions().subscribe((next) => { this.optionsVendor = next })



  }

  calculateBSA(height: number, weight: number): number {
    //Dubois formula: 0.007184 × H0.725 × W0.425
    var help = 0.0;
    help = 0.007184 * (Math.pow(height, 0.725) * Math.pow(weight, 0.425));
    this.bsa = help;
    this.showBSA = 1;
    return help;
  }

}
