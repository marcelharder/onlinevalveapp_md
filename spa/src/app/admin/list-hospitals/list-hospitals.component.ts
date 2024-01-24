import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DropItem } from 'src/app/_models/dropItem';
import { Hospital } from 'src/app/_models/Hospital';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { GeneralService } from 'src/app/_services/general.service';
import { HospitalService } from 'src/app/_services/hospital.service';

@Component({
  selector: 'app-list-hospitals',
  templateUrl: './list-hospitals.component.html',
  styleUrls: ['./list-hospitals.component.scss']
})
export class ListHospitalsComponent implements OnInit {

  selectedHospital: Partial<Hospital>;
  listOfHospitals: Array<Partial<Hospital>> = [];
  optionCountries: Array<DropItem> = [];
  details = 0;
  list = 1;
  edit = 0;
  selectedCountry = "Nederland";
  pagination: Pagination;

  constructor(
    private route: ActivatedRoute,
    private hos: HospitalService,
    private gen: GeneralService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.listOfHospitals = data.hospitals.result;
      this.pagination = data.hospitals.pagination;
    });
    this.gen.getListOfCountries().subscribe((next) => {this.optionCountries = next;})

  }

  contentFound() {if (this.listOfHospitals.length > 0) { return true;} else { return false; }}
  displayList() { if (this.list === 1) { return true; } else { return false; } }
  displayDetails() { if (this.details === 1) { return true; } else { return false; } }
  displayEdit() { if (this.edit === 1) { return true; } else { return false; } }

  search() {// this.selectedCountry is bv Greece
    this.loadHospitals();
  }

  addHospital() {
    this.hos.findNextHospitalCode().subscribe((next) => {
      var new_code = next;
      this.hos.getNewHospital(this.selectedCountry, new_code).subscribe((next) => {
        this.selectedHospital = next;
        this.details = 0; this.list = 0; this.edit = 1;
      })
    });

    this.alertify.message("adding ...")
  }

  deleteHospital() {
    this.hos.removeHospital(+this.selectedHospital.HospitalNo).subscribe(
      (next) => {
        this.alertify.message("deleting ...");
      },
      error => { this.alertify.error(error); },
      () => { this.details = 0; this.list = 1; this.edit = 0; })
  };

  cancel() { this.details = 0; this.list = 1; this.edit = 0; }

  saveDetails() {
    this.hos.saveDetails(this.selectedHospital).subscribe(
      (next) => { this.alertify.message(next) },
      (error) => { this.alertify.error(error) }, () => { this.details = 0; this.list = 1; this.edit = 0; });
  }

  showDetails(id: number) {
    this.selectedHospital = this.listOfHospitals.find(x => x.HospitalNo === id.toString());
    this.details = 1;
    this.list = 0;
    this.edit = 0;
  }

  loadHospitals() {
    this.hos.getListOfFullHospitalsPerCountry(this.selectedCountry,1,5).subscribe(
        (next: PaginatedResult<Hospital[]>) => {
          this.listOfHospitals = next.result;
          this.pagination = next.pagination;
        }, (error) => { this.alertify.error(error); });
  }

  returnFromAdding(help: string) {
    this.alertify.message(help);
    this.details = 0; this.edit = 0; this.list = 1;
    // refresh the page
    this.loadHospitals();
    return help;
  }


  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadHospitals();
  }

}
