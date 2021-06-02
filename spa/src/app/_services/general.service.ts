import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Hospital } from '../_models/Hospital';
import { DropItem } from '../_models/dropItem';

@Injectable()
export class GeneralService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getHospital() { return this.http.get<Hospital>(this.baseUrl + 'hospital'); }
    getVendorId(vendorname: string) { return this.http.get<number>(this.baseUrl + 'vendorId/' + vendorname); }
    getListOfCountries() { return this.http.get<DropItem[]>(this.baseUrl + 'countryList'); }

    getCountryCodeFromISO(countryname: string) {
        return this.http.get<string>(this.baseUrl + 'countryCodeFromISO/' + countryname);
    }
    getCountryIDFromDescription(countryname: string) {
        return this.http.get<string>(this.baseUrl + 'countryIDFromDescription/' + countryname);
    }
    getCountryName(countryCode: string) {
        return this.http.get<string>(this.baseUrl + 'countryNameFromID/' + countryCode, { responseType: 'text' as 'json' });
    }

    getBSA(height: number, weight: number){
      return this.http.get<number>(this.baseUrl + 'calculateBSA/' + height + '/' + weight);
    }


}
