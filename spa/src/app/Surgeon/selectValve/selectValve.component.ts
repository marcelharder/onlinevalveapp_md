import { Component, OnInit, TemplateRef } from '@angular/core';
import { DropItem } from 'src/app/_models/dropItem';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { valveSize } from 'src/app/_models/valveSize';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { DropService } from 'src/app/_services/drop.service';
import { GeneralService } from 'src/app/_services/general.service';
import { HospitalService } from 'src/app/_services/hospital.service';
import { ProductService } from 'src/app/_services/product.service';
import { ValveService } from 'src/app/_services/valve.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-selectValve',
  templateUrl: './selectValve.component.html',
  styleUrls: ['./selectValve.component.css']
})
export class SelectValveComponent implements OnInit {
  Title = "";
  HospitalName = "";
  bsa = 0.0;
  requestedDiameter = 0;

  heightOptions: Array<DropItem> = [];
  weightOptions: Array<DropItem> = [];
  selectedHeight = 0;
  selectedWeight = 0;

  optionsPos: Array<DropItem> = [];
  optionsType: Array<DropItem> = [];
  optionsVendor: Array<DropItem> = [];
  optionsInfo: Array<string> = [];

  valveSizes: Array<valveSize> = [];


  selectedPos = '';
  selectedType = '';
  selectedVendor = 0;
  messagePPM = "";
  showOVI = 0;

  products: Array<TypeOfValve> = [];
  productRequested = "";


  showProduct = 1;
  showBSA = 0;

  modalRef: BsModalRef;



  product: TypeOfValve = {
    ValveTypeId: 0,
    No: 0,
    uk_code: '',
    us_code: '',
    Description: '',
    Valve_size: [],
    Type: '',
    Vendor_description: '',
    Vendor_code: '',
    Model_code: '',
    image: '',
    Implant_position: '',
    countries: ''
  };

  constructor(private alertify: AlertifyService,
    private gen: GeneralService,
    private prod: ProductService,
    private drops: DropService,
    private vs: ValveService,
    private auth: AuthService,
    private modalService: BsModalService,
    private hs: HospitalService) { }

  ngOnInit() {
    this.selectedPos = "Aortic";

    if(this.auth.loggedIn()){
    // this
    this.auth.currentHospital.subscribe((next) => {
      this.HospitalName = next;
      // find out if this hospital is enrolled in the OVI program
      this.hs.isOVIPlace().subscribe(
        (next) => {
        if (next === 1) { this.showOVI = 1; };},
        (error)=>{this.alertify.error(error);},
        ()=>{this.loadDrops();})
    });

    }
    this.loadDrops();
    
    this.optionsInfo = 
    [
      'Patient prosthesis mismatch (PPM) was originally described by',
      ' Rahimtoola almost four decades ago as follows: “the effective',
      ' prosthetic valve area, after insertion into the patient, is',
      ' less than that of a normal human valve”. That is, PPM is a',
      ' situation in which the area of a perfectly functioning prosthetic',
      ' valve is too small for the body surface area (BSA) of that',
      ' patient. So, the indexed effective orifice area (IEOA) defined as',
      ' the ratio between the effective orifice area (EOA) of a prosthetic',
      ' valve and the BSA of that patient is the optimal parameter to',
      ' calculate PPM. The height and weight of the patient are needed',
      ' by the application to calculate the BSA. Further reading here:',
      ' Rahimtoola SH. The problem of valve prosthesis-patient mismatch. Circulation. 1978;58(1):20–4.'
    ];


  }


  Search() {
    if (this.selectedVendor !== 0 && this.selectedType !== '') {

      this.prod.getProductsByVTP(this.selectedVendor, this.selectedType, "Aortic").subscribe((next) => {
        this.products = next;
        this.showProduct = 1;
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



  displayOVI() { if (this.showOVI === 1) { return true; } else {return false;} }
  showProductList() { if (this.showProduct === 1) { return true; } }
  BSApresent() { if (this.showBSA === 1) { return true; } }


  






  searchDetails(id: any) {
    // check if the height and weight are entered, if not
    if(this.selectedHeight === 0){
      this.alertify.error("Please enter the height and weight of your patient ...");
    } else {
      this.prod.getValveSizes(id).subscribe((nex)=>{
        this.valveSizes = nex;
        this.gen.getBSA(+this.selectedHeight, +this.selectedWeight).subscribe((next)=>{
          this.bsa = next;
          this.valveSizes.forEach(element => {
            if ((element.eoa / this.bsa) > .85) { element.ppm = 'none' } else {
              if ((element.eoa / this.bsa) <= .85 && (element.eoa / this.bsa) >= .65) { element.ppm = "moderate" }
              else {
                if ((element.eoa / this.bsa) < .65) { element.ppm = "severe" }
              }
            }
          });
        });
        this.prod.getProductById(id).subscribe(
          (next) => {
            this.product = next;
            this.product.Valve_size = this.valveSizes;
          })
      },(error) => { this.alertify.error(error) },() => { this.showProduct = 0; });
    }
  }

  backFromDetails(id: any){this.showProduct = 1; }

  openModal(template: TemplateRef<any>) { this.modalRef = this.modalService.show(template); }

  loadDrops() {

    var i = 0;

    this.optionsType.push({ value: 0, description: "Choose" })
    this.optionsType.push({ value: 1, description: "Biological" })
    this.optionsType.push({ value: 2, description: "Mechanical" })

    this.weightOptions.push({ value: 0, description: "Choose" });
    for (i = 45; i < 160; i++) { this.weightOptions.push({ value: i, description: i.toString() }); }

    this.heightOptions.push({ value: 0, description: "Choose" });
    for (i = 150; i < 210; i++) { this.heightOptions.push({ value: i, description: i.toString() }); }

    this.drops.getCompanyOptions().subscribe((next) => { 
      this.optionsVendor = next;
      this.optionsVendor.unshift({value: 0, description: 'Choose'});
     

      
    })



  }





}
