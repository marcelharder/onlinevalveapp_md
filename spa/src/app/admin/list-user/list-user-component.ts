import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { DropService } from 'src/app/_services/drop.service';
import { DropItem } from 'src/app/_models/dropItem';
import { GeneralService } from 'src/app/_services/general.service';
import { HospitalService } from 'src/app/_services/hospital.service';

@Component({
  selector: 'listUser',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  listOfUsers: Array<User> = [];
  role: Array<DropItem> = [];
  companies: Array<DropItem> = [];

  selectedUser: User;
  pagination: Pagination;
  details = 0;
  ch = 0;
  model = { username: '', password: 'password' }
  optionCountries: Array<DropItem> = [];
  optionHospitals: Array<DropItem> = [];
  optionsAH: Array<DropItem> = [];
  optionsGender: Array<DropItem> = [];
  selectedCountry = '';
  selectedHospital = 0;
  hospitalDescription = '';
  currentHospital = '';

  constructor(private route: ActivatedRoute,
    private gen: GeneralService,
    private hos: HospitalService,
    private drop: DropService,
    private userService: UserService,
    private alertify: AlertifyService,
    private authService: AuthService) { }



  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.listOfUsers = data.users.result;
      this.pagination = data.users.pagination;
      this.loadDrops();
      this.gen.getListOfCountries().subscribe((next) => { this.optionCountries = next; });
    })
  }

  changeHospital() { if (this.ch === 1) { return true; } else { return false; } }
  showChangeHospital() { this.ch = 1 };

  contentFound() { if (this.listOfUsers.length > 0) { return true; } else { return false; } }

  userIsVendor() {
    if (this.selectedUser.userRole === 'companyadmin' || this.selectedUser.userRole === 'companyHQ') { return true; }
    else { return false; }
  }

  loadDrops() {
    if (localStorage.optionsGender === undefined) {
      this.optionsGender.push({ value: 0, description: 'Choose' });
      this.optionsGender.push({ value: 1, description: 'Male' });
      this.optionsGender.push({ value: 2, description: 'Female' });
      localStorage.setItem('optionsGender', JSON.stringify(this.optionsGender));

    } else {
      this.optionsGender = JSON.parse(localStorage.optionsGender);
    }
    if (localStorage.options_role === undefined) {
      this.drop.getRoleOptions().subscribe((next) => {
        this.role = next;
        localStorage.setItem('options_role', JSON.stringify(next));
      });
    } else {
      this.role = JSON.parse(localStorage.options_role);
    }
      // these item might change
      this.drop.getCompanyOptions().subscribe((next) => { this.companies = next; });
      this.drop.getAllHospitals().subscribe((next) => {this.optionsAH = next;});
  }
  

  loadUsers() {
    this.userService.getUsers(this.authService.decodedToken.nameid, this.pagination.currentPage, this.pagination.itemsPerPage).subscribe((res: PaginatedResult<User[]>) => {
      this.listOfUsers = res.result;
      this.pagination = res.pagination;
    }, (error) => { this.alertify.error(error); });
  }


  addUser() {
    this.userService.addUser(this.authService.decodedToken.nameid).subscribe(next => {
      this.selectedUser = next;
      this.model.username = 'newUser';
      this.model.password = 'password';
      this.authService.update(this.model).subscribe((nex) => {
        this.details = 1;
      }, (error) => { this.alertify.error(error) });

    })
  }
  deleteUser() {
    this.userService.deleteUser(this.selectedUser.userId).subscribe(next => {
      this.alertify.message('User deleted ...');
      this.details = 0;
    })
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  showDetails(id: number) {
    // get the details from the userArray
    this.selectedUser = this.listOfUsers.find(x => x.userId === id);

    this.details = 1;
    if (!this.userIsVendor()) {
      this.hos.getDetails(this.selectedUser.hospitalCode).subscribe((next) => { this.currentHospital = next.HospitalName; })
    }
    this.findHospitalsInCountry();
  }

  findHospitalsInCountry() {
    this.hos.getListOfHospitalsPerCountry(this.selectedUser.country).subscribe((nex) => {
      this.optionHospitals = nex;

    })


   /*  this.gen.getCountryIDFromDescription(this.selectedUser.country).subscribe((next) => {
      const code = next;
      this.hos.getListOfHospitalsPerCountry(code).subscribe((nex) => {
        this.optionHospitals = nex;

      })

    }) */


  }
  Search() {
    this.userService.getListOfUsersInHospital(this.authService.decodedToken.nameid, this.selectedHospital, 1, 10).subscribe((next) => {
      this.listOfUsers = next.result;
      this.pagination = next.pagination;
    });
  }
  hideDetails() {
   this.ch = 0;

    if (!this.userIsVendor()) {
      if (this.currentHospital === undefined || this.currentHospital === "") {
        this.alertify.error('Please enter the hospital where this person works');
        this.showChangeHospital();
      }
      else {
        const selectedDropItem = this.optionHospitals.find(f => f.description === this.currentHospital);
        this.selectedUser.hospitalCode = selectedDropItem.value;
        this.userService.saveUser(this.authService.decodedToken.nameid, this.selectedUser).subscribe(next => {
          this.details = 0;
        }, (error) => { this.alertify.error(error); });
      }
    }
    else {
      this.selectedUser.hospitalCode = 0;
      //const selectedDropItem = this.companies.find(f => f.description === this.selectedUser.worked_in);
      //this.selectedUser.worked_in = selectedDropItem.description;

      this.userService.saveUser(this.authService.decodedToken.nameid, this.selectedUser).subscribe(next => {
        this.details = 0;
      }, (error) => { this.alertify.error(error); });
    }
  }
  cancel() { this.details = 0; }

  displayDetails() { if (this.details === 1) { return true; } else { return false; } }
}
