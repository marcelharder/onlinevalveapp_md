import { OnInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/User';
import { NgForm } from '@angular/forms';
import { Photo } from '../_models/Photo';
import { GeneralService } from '../_services/general.service';
import { DropItem } from '../_models/dropItem';
import { HospitalService } from '../_services/hospital.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  model: any = {};
  oldPassWord = "";
  newPassWord = "";
  repPassWord = "";
  


  listCountries:Array<DropItem> = [];
  selectedCountry = "";
  photo: Photo =
    {
      id: 0,
      url: '',
      description: '',
      dateAdded: new Date(),
      isMain: false
    };
  @ViewChild('editForm') editForm: NgForm;
  affiliation = '';


  constructor(
    private route: ActivatedRoute,
    private hospital: HospitalService,
    private gen: GeneralService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getCountries().subscribe((next)=>{
      this.listCountries = next;
     // this.selectedCountry = this.listCountries.find(x => x.value == +this.user.country).description;
    });
    




    this.route.data.subscribe(data => {
      this.user = data.user;
      if (this.user.userRole === 'companyadmin') {
        this.affiliation = this.user.worked_in;
      }

      else {
        this.hospital.getDetails().subscribe((next) => {
           this.affiliation = next.HospitalName; });
      }


    });


  }

  updateUser() {
    this.userService.saveUser(+this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('Profile updated successfully');
      this.editForm.reset(this.user);
    }, error => { this.alertify.error(error); });
  }

  changeMainPhoto(photoUrl) { this.user.photoUrl = photoUrl; }

  ChangePWD(){
    if(this.newPassWord !== this.repPassWord){this.alertify.error("The passwords dont match ...")}
    else 
    {
      this.model.username = this.user.username;
      this.model.password = this.newPassWord;
      this.authService.update(this.model).subscribe((next)=>{
        this.alertify.success("Password changed");
        localStorage.removeItem('token');

      });
    }






   
    
    
  
  
  }
}

