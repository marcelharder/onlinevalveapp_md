import { Component, OnInit } from '@angular/core';
import { Valve } from 'src/app/_models/Valve';
import { AuthService } from 'src/app/_services/auth.service';
import { ValveService } from 'src/app/_services/valve.service';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-AddCompanyValve',
  templateUrl: './AddCompanyValve.component.html',
  styleUrls: ['./AddCompanyValve.component.css']
})
export class AddCompanyValveComponent implements OnInit {

  currentCompany = '';
  currentProduct = '';
  hospitalName = "";

  valveToAdd: Valve;

  constructor(private valveService: ValveService,
              private alertify: AlertifyService,
              private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.route.data.subscribe(data => { this.valveToAdd = data.valve; });
    this.currentProduct = this.valveToAdd.description;
    this.currentCompany = this.valveToAdd.vendor_name;
    this.auth.currentHospital.subscribe(result => {this.valveToAdd.hospital_code = parseInt(result, 10);});
  }

  saveValve(v: Valve) {
      this.valveService.saveValve(v).subscribe((next) => {
        this.alertify.message('valve uploaded ...');
        // go back to company admin
        this.router.navigate(['/companyadmin']);
      }, (error) => {
        console.log(error);
      });
  }

}
