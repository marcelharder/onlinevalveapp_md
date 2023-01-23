import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/_models/Hospital';
import { AuthService } from 'src/app/_services/auth.service';
import { GeneralService } from 'src/app/_services/general.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  hos: Hospital = {
    id: 0,
    naam: '',
    adres: '',
    postalCode: '',
    hospitalNo: 0,
    country: '',
    image: '',
    refHospitals: '',
    standardRef: '',
    email: '',
    contact: '',
    contact_image: '',
    telephone: '',
    fax: '',
    logo: '',
    mrnSample: '',
    sMS_mobile_number: '',
    sMS_send_time: '',
    triggerOneMonth: '',
    triggerTwoMonth: '',
    triggerThreeMonth: '',
    dBBackend: ''
};
  constructor(private gen: GeneralService, private auth: AuthService) { }

  ngOnInit() {
    this.gen.getHospital().subscribe((next) => { this.hos = next; });
    this.auth.changeCurrentHospital(this.hos.naam);

  }

}
