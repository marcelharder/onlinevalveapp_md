import { Component, OnInit } from '@angular/core';
import { DropItem } from 'src/app/_models/dropItem';
import { modelValveParams } from 'src/app/_models/modelValveParams';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { Valve } from 'src/app/_models/Valve';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { GeneralService } from 'src/app/_services/general.service';
import { ValveService } from 'src/app/_services/valve.service';

@Component({
  selector: 'app-lookInOVI',
  templateUrl: './lookInOVI.component.html',
  styleUrls: ['./lookInOVI.component.css']
})
export class LookInOVIComponent implements OnInit {

  Title = '';
  preference = true;
  lifeStyle = true;
  selectedSize = 0;
  selectedHeight = 0;
  selectedWeight = 0;
  aorticvalves: Array<Valve> = [];
  mitralvalves: Array<Valve> = [];
  heightOptions: Array<DropItem> = [];
  weightOptions: Array<DropItem> = [];
  sizesOptions: Array<DropItem> = [];
  pagination: Pagination;
  AproductRequested = "";
  MproductRequested = "";
  HospitalName = "";
  selectedPosition = 0;
  bsa = 0.0;

  ImagePath = "";

  moderatePPM = 0;
  severePPM = 0;
  showA = '0';
  showAo = 0;
  showM = 0;


  optionsPositions: Array<DropItem> = [];


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

  constructor(private vs :ValveService,
    private gen:GeneralService,
    private auth:AuthService,
    private alertify:AlertifyService) { }

  ngOnInit() {
    this.Title = "Hospital valves";
    this.loadDrops();
  }

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
        this.gen.getBSA(+this.selectedHeight, +this.selectedWeight).subscribe((next)=>{
           this.bsa = next;
           this.AproductRequested = "These aortic valves are available for implant in " + this.HospitalName;
           this.aorticvalves.forEach(element => {
            if (element.tfd > .85) { element.ppm = 'none' } else {
              if (element.tfd <= .85 && element.tfd >= .65) { element.ppm = "moderate" }
              else {
                if (element.tfd < .65) { element.ppm = "severe" }
              }
            }
          });
        })
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

  showAoValves() { if (this.showAo === 1) { return true; } }
  showMValves() { if (this.showM === 1) { return true; } }
  showPlaatje() { if (this.showAo !== 1 && this.showM !== 1) { return true; } }
  showSeverePPM() { if (this.severePPM === 1) { return true; } }
  showModeratePPM() { if (this.moderatePPM === 1) { return true; } }
  showAdvice() { if (this.showA === '1') { return true; } }

  onPositionChange() {
    if (this.selectedPosition.toString() === '0') { this.showAo = 0; this.showM = 0; this.AproductRequested = ""; this.MproductRequested = ""; }
    if (this.selectedPosition.toString() === '1') { this.showAo = 1; this.showM = 0; this.AproductRequested = "Aortic  valves"; this.MproductRequested = ""; }
    if (this.selectedPosition.toString() === '2') { this.showAo = 0; this.showM = 1; this.MproductRequested = "Mitral valves"; this.AproductRequested = ""; }
    if (this.selectedPosition.toString() === '3') { this.showAo = 1; this.showM = 1; this.AproductRequested = "Aortic  valves"; this.MproductRequested = "Mitral valves"; }
  }

  calculateBSA(height: number, weight: number): number {
    var help = 0;
     this.gen.getBSA(height, weight).subscribe((next)=>{
        help = next;
     })
    return help;
  }

  loadDrops() {
    this.optionsPositions.push({ value: 0, description: "Choose" });
    this.optionsPositions.push({ value: 1, description: "Aortic" });
    this.optionsPositions.push({ value: 2, description: "Mitral" });
    this.optionsPositions.push({ value: 3, description: "Aortic and Mitral" });



    var i = 0;
    this.sizesOptions.push({ value: 0, description: "Choose" });
    for (i = 16; i < 35; i++) { this.sizesOptions.push({ value: i, description: i.toString() }); }

    this.weightOptions.push({ value: 0, description: "Choose" });
    for (i = 45; i < 160; i++) { this.weightOptions.push({ value: i, description: i.toString() }); }

    this.heightOptions.push({ value: 0, description: "Choose" });
    for (i = 150; i < 210; i++) { this.heightOptions.push({ value: i, description: i.toString() }); }




  }


}
