import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ValveTransfer } from 'src/app/_models/ValveTransfer';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ValveService } from 'src/app/_services/valve.service';
import { Valve } from 'src/app/_models/Valve';
import { Router } from '@angular/router';
import { DropItem } from 'src/app/_models/dropItem';
import { UserService } from 'src/app/_services/user.service';
import { HospitalService } from 'src/app/_services/hospital.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-list_Transfers',
  templateUrl: './list_Transfers.component.html',
  styleUrls: ['./list_Transfers.component.css']
})
// tslint:disable-next-line:class-name
export class List_TransfersComponent implements OnInit {
  @Input() selectedValve: Valve;
  @Output() callBack: EventEmitter<Valve> = new EventEmitter(); 
  details = 0;
  transfers:Array<ValveTransfer>=[];

  optionsDepartureHospital: Array<DropItem> = [];
  optionsDestinationHospital: Array<DropItem> = [];

  currentTransfer: ValveTransfer = {
    Id:0,
    DepTime:new Date(),
    ArrTime:new Date(),
    Reason: '',
    departureCode: '',
    arrivalCode: '',
    ValveId: 0
  };

  constructor(private alertify: AlertifyService,
    private valveService: ValveService,
    private hos: HospitalService,
    private userservice: UserService,
    private auth: AuthService,
    private router: Router,
    private valveservice: ValveService) { }

  ngOnInit() {
    this.userservice.getCurrentCountryCode(+this.auth.decodedToken.nameid).subscribe((next)=>{
      const country = next; // is bv "7" in geval van Nederland
      this.hos.CountryDescriptionFromCountryCode(country).subscribe((next)=>{
        this.loadDrops(next);
      })
      
    });
    this.getListOfTransfers();
    
  }

  getListOfTransfers(){
    this.valveService.getValveTransfers(+this.auth.decodedToken.nameid, this.selectedValve.valveId)
    .subscribe((nex)=>{ this.transfers = nex; })
  }

  

  loadDrops(country: string) {
    // get the hospitals in the current country
    const d = JSON.parse(localStorage.getItem('options_departure_Hospital'));
    if (d == null || d.length === 0) {
      this.hos.getListOfHospitalsPerCountry(country).subscribe((response) => {
        debugger;

            this.optionsDepartureHospital = response;
            // tslint:disable-next-line:max-line-length
            if (this.optionsDepartureHospital.includes({value: 100, description: 'Plant'}) === false){ this.optionsDepartureHospital.unshift({value: 100, description: 'Plant'}); };
            // tslint:disable-next-line:max-line-length
            if (this.optionsDepartureHospital.includes({value: 0, description: 'Store'}) === false) { this.optionsDepartureHospital.unshift({value: 0, description: 'Store'});  };

            localStorage.setItem('options_departure_Hospital', JSON.stringify(response));

            this.optionsDestinationHospital =  this.optionsDepartureHospital;

            // If needed extra options can be inserted here

            localStorage.setItem('options_destination_Hospital', JSON.stringify(response));
        });
    } else {
        this.optionsDepartureHospital = JSON.parse(localStorage.getItem('options_departure_Hospital'));
        this.optionsDestinationHospital = JSON.parse(localStorage.getItem('options_destination_Hospital'));
    }

  }

  cancel() {

    this.details = 0;
    this.router.navigate(['/search']);

  }

  addTransfer() {
    this.details = 1;
    this.valveservice.addValveTransferDetails(+this.auth.decodedToken.nameid, this.selectedValve.valveId).subscribe((next) => {
      this.currentTransfer = next;}, 
      error => this.alertify.error(error), 
      ()=>{
        this.getListOfTransfers();
        this.updateLocation();
      })
    }

   updateTransfer(id: number) {
     this.details = 1;
     this.valveservice.getValveTransferDetails(+this.auth.decodedToken.nameid,id).subscribe((next)=>{
       this.currentTransfer = next;},error => this.alertify.error(error), 
       ()=>{
        this.getListOfTransfers();
        this.updateLocation();
      });
    }

   saveValveTransferDetails()
   {
    this.valveservice.updateValveTransferDetails(+this.auth.decodedToken.nameid, this.currentTransfer).subscribe((next) => {
       this.details = 0;},error => this.alertify.error(error), 
       ()=>{
        this.getListOfTransfers();
        this.updateLocation();
      });
   
    }
  
   removeValveTransfer(id: number)
   {
    this.valveService.removeValveTransfer(+this.auth.decodedToken.nameid, id).subscribe((next)=>{
      // remove from the local array
      this.transfers.filter(x => x.Id === id);
      this.details = 0;},error => this.alertify.error(error), 
      ()=>{
        this.getListOfTransfers();
        this.updateLocation();
      })
   }




  updateLocation()
  {
     // get the last dropItem of the last entry in the transfer array
     var help = this.currentTransfer.arrivalCode; // is bv Medisch Spectrum Enschede
     var index = this.optionsDestinationHospital.find(x => x.description === help);
     debugger;
       
     
     
     
     this.selectedValve.hospital_code = index.value;
     // save it back to the database
     this.valveService.saveValve(this.selectedValve).subscribe((next)=>{
      // get the saved valve
      this.valveService.getValveBySerial(this.selectedValve.serial_no, '1').subscribe((next)=>{
        this.callBack.emit(next);
      })
      // save the new location back to the parent
      
     })
  }
  showDetails() { if (this.details === 1) { return true; } }

}
