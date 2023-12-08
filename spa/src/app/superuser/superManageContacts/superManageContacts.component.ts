import { Component, Input, OnInit } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { DropItem } from 'src/app/_models/dropItem';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-superManageContacts',
  templateUrl: './superManageContacts.component.html',
  styleUrls: ['./superManageContacts.component.css']
})
export class SuperManageContactsComponent implements OnInit {
  @Input() selectedHospital: Hospital;
  contactNames:DropItem[];
  current_contact_username = "";
  current_contact_image = "";
  

  constructor(private alertify: AlertifyService, private userService: UserService) { }

  ngOnInit() {
    // get username from contact
    this.userService.getUser(+this.selectedHospital.contact).subscribe((next)=>{
      this.current_contact_username = next.username;
      this.current_contact_image = next.photoUrl;
    });

    // get contacts for this hospital
  }
  ContactTitle() { return "Hier komt de contact page title"; }

  

}
