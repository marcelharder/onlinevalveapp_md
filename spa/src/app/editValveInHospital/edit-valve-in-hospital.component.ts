import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Valve } from '../_models/Valve';
import { DropItem } from '../_models/dropItem';
import { GeneralService } from '../_services/general.service';
import { AlertifyService } from '../_services/alertify.service';
import { DropService } from '../_services/drop.service';
import { AuthService } from '../_services/auth.service';
import * as moment from 'moment';
import { ValveTransfer } from '../_models/ValveTransfer';
import { ValveService } from '../_services/valve.service';


@Component({
    selector: 'app-edit-valve-in-hospital',
    templateUrl: './edit-valve-in-hospital.component.html'
})

export class EditValveInHospitalComponent implements OnInit {

    @Input() valve: Valve;
    @Input() sizes: number[];
    @Output() valveBack = new EventEmitter<Valve>();
    optionsImplant: Array<DropItem> = [];
    optionsSizes: Array<number> = [];
    HospitalName = '';
    VendorName = '';
  
    // sendPanel = 0;

    constructor(
        private gen: GeneralService,
        private auth: AuthService,
        private alertify: AlertifyService,
        private router: Router,
        private valveService: ValveService,
        private drops: DropService) {

    }
    ngOnInit(): void {
        debugger;
        this.optionsSizes = this.sizes;
      // get the hospitalName from the auth service, because the valve is not here yet
      this.auth.currentHospital.subscribe((next) => {this.HospitalName = next; });
      // get ValveSizes based onserialNumber

      this.loadDrops();
    }

    superUserLoggedin() { if (this.auth.decodedToken.role === 'superuser') { return true; } else { return false; } }

    Cancel() {
        //remove the just added valve
        debugger;
        this.valveService.deleteValve(this.valve.valveId).subscribe(
            (next)=>{
                debugger;
                if(next === "1"){this.alertify.message('Cancelling ...');} else {this.alertify.message('Could not delete this valve');}
                }, (error)=>{this.alertify.error(error)});
        
        this.router.navigate(['/home']);
    }

    Save() {
       if (this.canIGo()) {
            this.valveBack.emit(this.valve);
         } else {
             // log the error;

            }


    }


    loadDrops() {
      

        const d = JSON.parse(localStorage.getItem('implant_options'));
        if (d == null || d.length === 0) {
            this.drops.getImplantedOptions().subscribe((response) => {
                this.optionsImplant = response; localStorage.setItem('implant_options', JSON.stringify(response));
            });
        } else {
            this.optionsImplant = JSON.parse(localStorage.getItem('implant_options'));
        }
    }

    canIGo(): boolean {
        let help = false;

        if (this.valve.manufac_date.toString() === '0001-01-01T00:00:00') { this.alertify.error('Please enter manufac date ...'); } else {
            if (this.valve.expiry_date.toString() === '0001-01-01T00:00:00') { this.alertify.error('Please enter expiry date ...'); } else {
                if (this.valve.serial_no === '') { this.alertify.error('Please enter valve serial number ...'); } else {
                     if (this.valve.size === '') { this.alertify.error('Please enter valve size ...'); } else {
                          help = true; } }
            }
        }

        const currentDate = new Date();
        if (moment(currentDate).isAfter(this.valve.expiry_date)) {
            this.alertify.error('This valve is already expired ...');
            help = false;
        }


        return help;
    }

}

