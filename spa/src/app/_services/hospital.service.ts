import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Hospital } from '../_models/Hospital';
import { DropItem } from '../_models/dropItem';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable()
export class HospitalService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getVendorsInHospital() { return this.http.get<DropItem[]>(this.baseUrl + 'hospital/vendors'); }
  getListOfHospitalsWhereVendorIsActive() { return this.http.get<DropItem[]>(this.baseUrl + 'sphlist'); }
  getHospitalFromHospitalCode(code: number) {return this.http.get<string>(this.baseUrl + 'getHospitalDetails/' + code, { responseType: 'text' as 'json' });}
  
  getListOfFullHospitalsPerCountry(countryCode: string, pageNumber: number, pageSize: number)
  {
    const paginatedResult: PaginatedResult<Hospital[]> = new PaginatedResult<Hospital[]>();
    let params = new HttpParams();
    if (pageNumber != null && pageSize != null) {
        params = params.append('pageNumber', pageNumber.toString());
        params = params.append('pageSize', pageSize.toString());
        params = params.append('code', countryCode);
    }

    return this.http.get<Hospital[]>(this.baseUrl + 'getFullHospitalsInCountry',{ observe: 'response', params } )
        .pipe(
            map(response => {
                paginatedResult.result = response.body;
                if (response.headers.get('Pagination') !== null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')); }
                return paginatedResult;
            }));
    
    
    
    
   // return this.http.get<PaginatedResult<Hospital[]>>(this.baseUrl + 'getFullHospitalsInCountry/' + countryCode);
   }
  getListOfHospitalsPerCountry(countryCode: string)
  { return this.http.get<DropItem[]>(this.baseUrl + 'getHospitalsInCountry/' + countryCode); } // countryDescription
  
  getNewHospital(country: string){
   return this.http.post<Hospital>(this.baseUrl + 'createHospital/' + country, null, { responseType: 'text' as 'json' });}

 removeHospital(code: number){return this.http.delete<string>(this.baseUrl + 'deleteHospital/' + code,  { responseType: 'text' as 'json' })} 
  
  
  getFullHospitalsWhereVendorIsActive() { return this.http.get<Hospital[]>(this.baseUrl + 'sphlist_full'); }
  getFullHospitalsWhereVendorIsNotActive() { return this.http.get<Hospital[]>(this.baseUrl + 'neg_sphlist_full'); }
  
  addVendor(vendor: string) { return this.http.get<string>(this.baseUrl + 'addVendor' + '/' + vendor, { responseType: 'text' as 'json' }); }
  replaceVendor(vendor: string) { return this.http.get<string>(this.baseUrl + 'replaceVendor' + '/' + vendor, { responseType: 'text' as 'json' }); }
 
  removeVendor(vendor: string) { return this.http.get<string>(this.baseUrl + 'removeVendor' + '/' + vendor, { responseType: 'text' as 'json' }); }
  getDetails() { return this.http.get<Hospital>(this.baseUrl + 'getHospitalDetails'); }
  saveDetails(h: Partial<Hospital>) { return this.http.put<string>(this.baseUrl + 'saveHospitalDetails', h, { responseType: 'text' as 'json' }); }
  isOVIPlace(){return this.http.get<number>(this.baseUrl + 'isOVIPlace');}

  saveContactToHospital(contact:string,contactImage:string){return this.http.get<number>(
    this.baseUrl + 'saveContactToHospital/' + contact + '/' + encodeURIComponent(contactImage));}
   
}
