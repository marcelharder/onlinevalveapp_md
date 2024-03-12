import { Component, OnInit, Input } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import { HospitalService } from 'src/app/_services/hospital.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { GeneralService } from 'src/app/_services/general.service';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-list-hospitals-for-ref',
  templateUrl: './list-hospitals-for-ref.component.html',
  styleUrls: ['./list-hospitals-for-ref.component.css']
})
export class ListHospitalsForRefComponent implements OnInit {
  @Input() hos: Hospital[];
  contactName = '';
  currentCountry = '';
  currentVendor = '';
  detailsPage = 0;
  selectPage = 0;
  FullHospitals: Array<Hospital> = [];

  selectedHospital: Partial<Hospital> = {};

  hospitalDescription = '';

  constructor(private auth: AuthService,
    private user: UserService,
    private router: Router,
    private hosService: HospitalService,
    private alertify: AlertifyService,
    private gen: GeneralService) {

  }
  ngOnInit(): void {
    let rep: User;
    this.user.getUser(this.auth.decodedToken.nameid).subscribe((next) => {
      rep = next;
      this.currentVendor = next.vendorName;
      this.currentCountry = next.country;
    });
   
  }
  showDetails() { if (this.detailsPage === 1) { return true; } }
  showSelectPage() { if (this.selectPage === 1) { return true; } }

  selectDetails(id: string) {
     // get the selectedHospital from the list
     const found = this.hos.find((Hospital) => {return Hospital.HospitalNo === id});
     if (found) {
      this.selectedHospital = found;
      this.detailsPage = 1;
      this.selectPage = 0;
    }





   /*  this.detailsPage = 1;
    this.selectPage = 0;
    this.hosService.getSpecificHospitalDetails(id).subscribe((next) => {
      debugger;
      this.selectedHospital = next;
    }); */
  }
  updateHospitalDetails(s: Hospital) {
    this.hosService.saveDetails(s).subscribe((next) => {
      this.alertify.message(next);
      this.detailsPage = 0;
    });
  }

  backFromEditPage(id: number){
    this.detailsPage = 0;
    this.selectPage = 0;
    // the id number here id the id of the hospital that has been removed in the edit page
    // so delete this hospital from the list of hospitals
    debugger;
    this.hos = this.hos.filter(x => x.HospitalNo != id.toString());

  }
  selectThisHospital(id: string) {
    this.hosService.addVendor(this.currentVendor, id).subscribe((next) => {
      // tranfer from FullHospitals to hos
      var transfer = this.FullHospitals.find(x => x.HospitalNo == id);
      this.hos.push(transfer);
      this.FullHospitals = this.FullHospitals.filter(x => x.HospitalNo == id);

      this.detailsPage = 0;
      this.selectPage = 0;
    }, error => { this.alertify.message(error) });
  }
  AddHospital() {
    this.detailsPage = 0;
    this.selectPage = 1;
    this.alertify.message('Adding hospital');
  }



  DisplayHospitalsInTheCurrentCountry() {
    this.detailsPage = 0;
    this.selectPage = 1;
    this.alertify.success('Display a list of hospitals where this vendor is not active, yet');
    this.hosService.getFullHospitalsWhereVendorIsNotActive().subscribe((next) => {
      this.FullHospitals = next;
    });



  }

}
