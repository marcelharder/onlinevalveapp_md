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
  @Input() hos: Hospital;
  contactName = '';
  hospitalContactNumber =  0;
  currentCountry = '';
  currentVendor = '';
  detailsPage = 0;
  selectPage = 0;
  FullHospitals: Array<Hospital> = [];

  selectedHospital: Partial<Hospital> = { };

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
      // tslint:disable-next-line:no-shadowed-variable
     // this.gen.getCountryName(rep.country).subscribe((next) => { this.currentCountry = next; });
    });
  }
  showDetails() { if (this.detailsPage === 1) { return true; } }
  showSelectPage() { if (this.selectPage === 1) { return true; } }

  selectDetails(id: number) {

    this.detailsPage = 1;
    this.selectPage = 0;

    this.hosService.getDetails().subscribe((next) => {

      this.selectedHospital = next;
       
      this.hospitalContactNumber = parseInt(this.selectedHospital.Contact, 10);
      //this.auth.changeCurrentRecipient(hospitalContactNumber);
      this.user.getUser(this.hospitalContactNumber).subscribe((reponse) => {
          this.contactName = reponse.username;
          this.selectedHospital.Contact_image = reponse.photoUrl;
        } );

    });


  }
  updateHospitalDetails(s: Hospital) {

    this.hosService.saveDetails(s).subscribe((next) => {
        this.alertify.message(next);
        this.detailsPage = 0;
    });
  }
  selectThisHospital(id: number) {
    this.hosService.addVendor(this.currentVendor).subscribe((next) => {
      if (next === 'updated') {
        this.router.navigate(['/home']);
      }
    });
  }
  AddHospital() {
    this.detailsPage = 0;
    this.selectPage = 1;
    this.alertify.message('Adding hospital');
  }



  DisplayHospitalsInTheCurrentCountry() {
    this.detailsPage = 0;
    this.selectPage = 1;
    this.alertify.message('Display a list of hospitals where this vendor is not active, yet');
    this.hosService.getFullHospitalsWhereVendorIsNotActive().subscribe((next) => {
      this.FullHospitals = next;
    });



  }

}
