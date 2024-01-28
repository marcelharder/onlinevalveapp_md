import { Component, OnInit } from '@angular/core';
import { DropItem } from '../_models/dropItem';
import { TypeOfValve } from '../_models/TypeOfValve';
import { Valve } from '../_models/Valve';
import { GeneralService } from '../_services/general.service';
import { AlertifyService } from '../_services/alertify.service';
import { VendorService } from '../_services/vendor.service';
import { ValveService } from '../_services/valve.service';
import { HospitalService } from '../_services/hospital.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { valveSize } from "../_models/valveSize";
import { ProductService } from '../_services/product.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-add-valve',
    templateUrl: './add-valve.component.html'
})

export class AddValveComponent implements OnInit {
    hospitalName = '';
    valveImage = 'https://res.cloudinary.com/marcelcloud/image/upload/v1562767670/k3i7u3fsk2119albutak.jpg';
    SelectedHospitalVendor = 0;
    SelectedProduct = 0;
    done = 0;
    currentCountry = "";
    drop: DropItem;
    allVendors: Array<DropItem> = [];
    optionsHospitalVendors: Array<DropItem> = [];
    optionsHospitalProducts: Array<DropItem> = [];
    details = 0;
    allValves = 0;
    valveSizes: Array<number> = [];
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
    valveInParent: Valve;

    constructor(private gen: GeneralService,
        private alertify: AlertifyService,
        private auth: AuthService,
        private prod: ProductService,
        private ven: VendorService,
        private router: Router,
        private vs: ValveService,
        private hos: HospitalService) { }

    ngOnInit(): void {
        var vendorvalues: string[] = [];
        this.hos.getDetails().subscribe((next) => { // get the current hospital
            this.hospitalName = next.HospitalName;
            this.currentCountry = next.Country;
            vendorvalues = next.Vendors.split(',');

            this.ven.getVendors().subscribe((next) => { // get the vendors active in this hospital bv 9,7
                this.allVendors = next;
                for (var x = 0; x < vendorvalues.length; x++) {
                    var help = this.allVendors.find(a => a.value === +vendorvalues[x]);
                    this.optionsHospitalVendors.push(help);
                }
                this.optionsHospitalVendors.unshift({ value: 0, description: "Choose" })
            });
        });
    }

    findValveshere(s: number) {
        this.optionsHospitalProducts = [];
        this.ven.getProductByVendorAndIsoCode(s, this.currentCountry).subscribe((next) => {
            for (var x = 0; x < next.length; x++) { this.optionsHospitalProducts.push(next[x]); }
        });
    }

    getPresets(p: number) {
        debugger;
        if (p !== 0) {
            // get the valveSizes that belog to this valve
            this.valveSizes = [];
            this.prod.getValveSizes(p).subscribe((next) => {
                next.forEach((el) => { this.valveSizes.push(el.size); });
                this.valveSizes = this.valveSizes.sort((n1, n2) => n1 - n2);
            })
           
            // get the selected product, this selectedProduct

            this.vs.getValveBasedOnValveCode(p).subscribe((next) => {
               
                this.valveInParent = next;
                this.details = 1;
                // get the serial number from the auth service is the number they put to search for the valve
                this.auth.currentSerial.subscribe((n) => { this.valveInParent.serial_no = n; });

            });
        } else { this.alertify.error('You have to select a type of valve, or use the \'custom valve\' button'); }
    }

    showDetails() { if (this.details === 1) { return true; } else { return false; } }

    selectCustomValve() {
        this.alertify.message('This will not work for the moment, because your vendor should add the type of this valve');
        // this.valveInParent = {
        //    "Id":0,
        //    "No": 0,
        //    "Description": "",
        //    "Vendor_code": "",
        //    "Vendor_name": "",
        //    "ValveSizes": [],
        //    "Product_code": "",
        //    "Type": "",
        //    "Location": "",
        //    "Manufac_date": new Date,
        //    "Expiry_date": new Date,
        //    "Serial_no": "",
        //    "Model_code": "",
        //    "Size": "",
        //    "Implant_position": "",
        //    "Procedure_id": 0,
        //    "implanted": 0,
        //    "Hospital_code": 0
        // };
        // this.details = 1;
    }

    showDoneButton() { if (this.done === 1) { return true; } }
    doneWithThis() {
        // jump naar super user page
        this.router.navigate(['/home']);
    }

    handleValveBack($event) {
        this.details = 0;
        this.done = 1;
        // reset the dropdowns
        this.SelectedHospitalVendor = 0;
        this.SelectedProduct = 0;
        // show the done button
        this.valveInParent = $event;

        this.vs.saveValve(this.valveInParent).subscribe((next) => { }, (error) => { this.alertify.error(error); });

    }

}
