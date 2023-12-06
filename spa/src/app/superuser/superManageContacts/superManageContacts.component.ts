import { Component, Input, OnInit } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';

@Component({
  selector: 'app-superManageContacts',
  templateUrl: './superManageContacts.component.html',
  styleUrls: ['./superManageContacts.component.css']
})
export class SuperManageContactsComponent implements OnInit {
@Input() selectedHospital: Hospital;
  constructor() { }

  ngOnInit() {
  }

}
