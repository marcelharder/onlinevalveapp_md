import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { Hospital } from 'src/app/_models/Hospital';
import { HospitalService } from 'src/app/_services/hospital.service';
import { AuthService } from 'src/app/_services/auth.service';
import { VendorService } from 'src/app/_services/vendor.service';
import { GeneralService } from 'src/app/_services/general.service';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-settings-company',
  templateUrl: './settings-company.component.html',
  styleUrls: ['./settings-company.component.scss']
})

export class SettingsCompanyComponent implements OnInit {
  selected = '';
  FullProducts: Array<TypeOfValve> = [];
  FullHospitals: Array<Hospital> = [];
  vendorId = 0;

  constructor(private route: ActivatedRoute,
    private hos: HospitalService,
    private auth: AuthService,
    private ven: VendorService,
    private gen: GeneralService,
    private user: UserService) { }

  ngOnInit() {

    this.route.params.subscribe(params => { this.selected = params.id; });

    let rep: User;


    this.user.getUser(this.auth.decodedToken.nameid).subscribe((next) => {
      rep = next;
      this.ven.getAllFullProducts(next.vendorCode).subscribe((nex) => { this.FullProducts = nex; });
      this.hos.getFullHospitalsWhereVendorIsActive().subscribe((ne) => { this.FullHospitals = ne; });
    });
  }

  showHospitals() { if (this.selected === '1') { return true; } }
  showProducts() { if (this.selected === '2') { return true; } }


}
