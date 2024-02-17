import { Component, OnInit } from '@angular/core';
import { Hospital } from '../_models/Hospital';
import { Valve } from '../_models/Valve';
import { AlertifyService } from '../_services/alertify.service';
import { ValveService } from '../_services/valve.service';
import { GeneralService } from '../_services/general.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { HospitalService } from '../_services/hospital.service';

@Component({
    selector: 'app-superuser',
    templateUrl: './superuser.component.html',
    styleUrls: ['./superuser.component.scss']
})

export class SuperuserComponent implements OnInit {
    valveInParent: Valve = {
        valveId: 0,
        no: 0,
        description: '',
        vendor_code: '',
        vendor_name: '',
        valveSizes: [],
        product_code: '',
        type: '',
        location: '',
        manufac_date: new Date(),
        expiry_date: new Date(),
        Implant_date: new Date(),
        serial_no: '',
        ppm: '',
        tfd: 0,
        model_code: '',
        size: '',
        patchSize: '',
        image: '',
        implant_position: '',
        procedure_id: 0,
        implanted: 0,
        hospital_code: 0,
    };

    procl = 0;
    procd = 0;
    mc = 1;
    nav = 1;
    procadd = 0;
    EmailAndSMS = 0;
    notF = 0;
    searchString = '';
    productRequested = '';
    hos: Partial<Hospital> = { };
    valves: Array<Valve> = [];
    IsValveImplanted = 0;

    constructor(
        private router: Router,
        private alertify: AlertifyService,
        private auth: AuthService,
        private vs: ValveService,
        private hospital: HospitalService,
        private gen: GeneralService) { }

    ngOnInit(): void {
        

    }

    findSerial() {
        if (this.searchString !== '') {
            this.nav = 0;
            this.procl = 0;
            this.vs.getValveBySerial(this.searchString, '2')
                .subscribe((next) => {
                    if (next === null) {
                        this.procd = 0;
                        this.notF = 1;
                    } else {
                        this.valveInParent = next;
                        this.procd = 1; // showEditPage
                        this.notF = 0;
                    }
                });
        }
    }
    cancel() {
        this.notF = 0;
        this.nav = 1;
        this.searchString = '';
    }

    notFound() { if (this.notF === 1) { return true; } else { return false; } }
    showProductList() { if (this.procl === 1) { return true; } else { return false; } }
    showAddPage() { if (this.procadd === 1) { return true; } else { return false; } }
    showMainContent() { if (this.mc === 1) { return true; } else { return false; } }
    showNavBar() { if (this.nav === 1) { return true; } else { return false; } }
    showEditPage() { if (this.procd === 1) { return true; } else { return false; } }
    displayEmailAndSMS() {
        if (this.EmailAndSMS === 1) { return true; } else { return false; }

    }


    displayAddPage() {
        this.auth.changeCurrentSerial(this.searchString);
        this.procd = 0; // hide showEditPage
        this.mc = 0;
        this.procadd = 1;
    }

    getValves(soort: number, position: number) {
        this.procl = 1;
        if (soort === 1 && position === 1) { this.productRequested = 'Mechanical Aortic Valves'; }
        if (soort === 1 && position === 2) { this.productRequested = 'Mechanical Mitral Valves'; }
        if (soort === 2 && position === 1) { this.productRequested = 'Biological Aortic Valves'; }
        if (soort === 2 && position === 2) { this.productRequested = 'Biological Mitral Valves'; }
        if (soort === 3 && position === 1) { this.productRequested = 'Valved Conduit'; }
        if (soort === 4 && position === 2) { this.productRequested = 'Annuloplasty Ring'; }
        if (soort === 5 && position === 3) { this.productRequested = 'Pericardial Patch'; }


        this.vs.getValves(soort, position).subscribe((next) => { this.valves = next; });
    }



    rqDt($event: any) { // this are the details of the selected valve, comes back from the list
        const id = $event;
        this.vs.getValve(id).subscribe((next) => {
            this.valveInParent = next;
            // save the hospital_code to the authservice in Behavior subject
            this.hospital.getHospitalFromHospitalCode(this.valveInParent.hospital_code).subscribe(
                (nex) => {
                    this.auth.changeCurrentHospital(nex);
                }, (error) => { console.log(error); });
        });
        // show the editpage
        this.procd = 1;
        // hide the list page
        this.mc = 0;
    }

    handleValveBack(returnedValve: Valve) { // comes back from edit page and can potentially be signalling a valve that is used !
        this.procd = 0;
        this.mc = 1;
        this.nav = 1;


        if (this.IsValveImplanted !== +returnedValve.implanted) {
            if (+returnedValve.implanted === 4) {
                // 4 means 'sent back to vendor'
                this.saveValve(returnedValve);
            }
            else {
                // The superuser has marked this valve as newly implanted.
                this.valveInParent.Implant_date = new Date();
                this.mc = 0;
                this.nav = 0;
                this.EmailAndSMS = 1;
            }
        } else {
            this.saveValve(returnedValve);
        }
    }

    returnFromAnnouncingUsedValve(help: Valve) {
        this.EmailAndSMS = 0; this.mc = 1; this.nav = 1;
        this.saveValve(help);
    }

    private saveValve(valveToBeSaved: Valve) {
        this.vs.saveValve(this.valveInParent).subscribe((next) => {
            this.alertify.message('Saving the valve');
        }, (error) => { this.alertify.error(error); });
    }





}
