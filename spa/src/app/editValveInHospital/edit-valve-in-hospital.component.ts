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
import { valveSize } from '../_models/valveSize';
import { ProductService } from '../_services/product.service';
import { TypeOfValve } from '../_models/TypeOfValve';
import { HospitalService } from '../_services/hospital.service';


@Component({
    selector: 'app-edit-valve-in-hospital',
    templateUrl: './edit-valve-in-hospital.component.html'
})

export class EditValveInHospitalComponent implements OnInit {

    @Input() valve: Valve;
    @Input() hospitalName:string;
    @Input() sizes: number[];
    @Output() valveBack = new EventEmitter<Valve>();

    PositionList = [
        { value: "Aortic", name: "Aortic" },
        { value: "Mitral", name: "Mitral" },
        { value: "Tricuspid", name: "Tricuspid" },
        { value: "Other", name: "Other" }]
    SizeList = [
        { value: "10 x 10", name: "10 x 10" },
        { value: "20 x 20", name: "20 x 20" },
        { value: "20 x 40", name: "20 x 40" }]
    optionsImplant: Array<DropItem> = [];
    valveSizes: Array<valveSize> = [];
    valveIsPatch = false;
    ch = 0;
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

    VendorName = '';

    // sendPanel = 0;

    constructor(
        private gen: GeneralService,
        private hos: HospitalService,
        private auth: AuthService,
        private alertify: AlertifyService,
        private router: Router,
        private prod: ProductService,
        private valveService: ValveService,
        private drops: DropService) {

    }
    ngOnInit(): void {
        if (this.valve.type === "Pericardial Patch") { this.valveIsPatch = true; }
        this.hos.getSpecificHospitalDetails(+this.hospitalName).subscribe((next)=>
        {
            this.hospitalName = next.SelectedHospitalName;
        })
        
      
        this.loadDrops();
    }

    getPatchType() {
        if (this.valve.type === "Pericardial Patch") { return true };
    }

    displayChangeSize() { if (this.ch === 1) { return true; } }

    superUserLoggedin() { if (this.auth.decodedToken.role === 'superuser') { return true; } else { return false; } }

    Cancel() { this.router.navigate(['/home']); }

    Save() {
        if (this.canIGo()) {
           
            this.valveBack.emit(this.valve);
        } else {
            // log the error;

        }


    }

    selectThisValve(id: number) {
        this.ch = 0;
        this.valve.size = id.toString();
    }
    changeSize() {
        this.ch = 1;
        // find the valvetype through the modelNo, get the valve sizes
        this.prod.getProductByProduct_code(this.valve.product_code).subscribe((next) => {
           this.prod.getValveSizes(next.ValveTypeId).subscribe((next) => {
                this.valveSizes = next;
            })

            this.alertify.message(this.product.Description);
        }, error => {
            this.alertify.error(error);
        })
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
                        help = true;
                    }
                }
            }
        }

        const currentDate = new Date();
        if (moment(currentDate).isAfter(this.valve.expiry_date)) {
            this.alertify.error('This valve is already expired ...');
            help = false;
        }

        if(!this.getPatchType()){
            
        if (this.valve.size === null || this.valve.size === "") {
            this.alertify.error('Please enter valve size ...');
            help = false;
        } 
        } else {
            if (this.valve.patchSize === null || this.valve.patchSize === "") {
                this.alertify.error('Please enter patch size ...');
                help = false;
            }  
        }



        return help;
    }

}

