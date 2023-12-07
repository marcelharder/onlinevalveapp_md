import { Component, Input, OnInit } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-superManageContacts',
  templateUrl: './superManageContacts.component.html',
  styleUrls: ['./superManageContacts.component.css']
})
export class SuperManageContactsComponent implements OnInit {
  @Input() selectedHospital: Hospital;

  constructor(private alertify: AlertifyService) { }

  ngOnInit() {
    
  }
  ContactTitle() { return "adding"; }

  addContact() { this.alertify.message("Adding contact") }

}
