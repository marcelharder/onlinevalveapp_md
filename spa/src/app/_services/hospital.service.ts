import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Hospital } from '../_models/Hospital';
import { DropItem } from '../_models/dropItem';

@Injectable()
export class HospitalService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getVendorsInHospital() { return this.http.get<DropItem[]>(this.baseUrl + 'hospital/vendors'); }

  getListOfHospitalsWhereVendorIsActive() { return this.http.get<DropItem[]>(this.baseUrl + 'sphlist'); }
  getHospitalFromHospitalCode(code: number) {return this.http.get<string>(this.baseUrl + 'hospitalName/' + code, { responseType: 'text' as 'json' });}


  getListOfHospitalsPerCountry(countryCode: string)
  { return this.http.get<DropItem[]>(this.baseUrl + 'getHospitalsInCountry/' + countryCode); } // countrycode is 31 bv

  getFullHospitalsWhereVendorIsActive() { return this.http.get<Hospital[]>(this.baseUrl + 'sphlist_full'); }
  getFullHospitalsWhereVendorIsNotActive() { return this.http.get<Hospital[]>(this.baseUrl + 'neg_sphlist_full'); }

  // tslint:disable-next-line:max-line-length
  addVendor(vendor: string, hospitalId: number) { return this.http.get<string>(this.baseUrl + 'addVendor' + '/' + vendor + '/' + hospitalId, { responseType: 'text' as 'json' }); }

  // tslint:disable-next-line:max-line-length
  removeVendor(vendor: string, hospitalId: number) { return this.http.get<string>(this.baseUrl + 'removeVendor' + '/' + vendor + '/' + hospitalId, { responseType: 'text' as 'json' }); }

  getDetails(hospitalId: number) { return this.http.get<Hospital>(this.baseUrl + 'getHospitalDetails' + '/' + hospitalId); }
  saveDetails(h: Hospital) { return this.http.post<string>(this.baseUrl + 'saveHospitalDetails', h, { responseType: 'text' as 'json' }); }


}
