import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Vendor } from '../_models/Vendor';
import { DropItem } from '../_models/dropItem';
import { TypeOfValve } from '../_models/TypeOfValve';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable()
export class VendorService {
    
    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }


    getVendorsFull(nameid: any, page: number, itemsPerPage: number) {
        const paginatedResult: PaginatedResult<Vendor[]> = new PaginatedResult<Vendor[]>();
        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page.toString());
            params = params.append('pageSize', itemsPerPage.toString());
        }
        return this.http.get<Vendor[]>(this.baseUrl + 'vendorsFull',{ observe: 'response', params } )
        .pipe(
            map(response => {
                paginatedResult.result = response.body;
                if (response.headers.get('Pagination') !== null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')); }
                return paginatedResult;
            }));
    }

    updateVendor(v: Vendor){return this.http.put<string>(this.baseUrl + 'updatevendor/', v, { responseType: 'text' as 'json' });}

    addVendor(){return this.http.get<Vendor>(this.baseUrl + 'addvendor');}

    deleteVendor(id: number){return this.http.delete<string>(this.baseUrl + 'deletevendor/' + id, { responseType: 'text' as 'json' });}

    getVendors() { return this.http.get<DropItem[]>(this.baseUrl + 'vendors'); }

    getVendor(database_no: string) { return this.http.get<Vendor>(this.baseUrl + 'vendor/' + database_no); }

    getVendorByName(name: string) { return this.http.get<Vendor>(this.baseUrl + 'vendorByName/' + name); }

    getVendorContactPerson(vendorId: number){ return this.http.get<number>(this.baseUrl + 'vendorContact/' + vendorId);}

    getProductByVendor(vendorId: number, country: string) { return this.http.get<DropItem[]>(
        this.baseUrl + 'vendor/valvecodes/' + vendorId + '/' + country); }
    
    getAllFullProducts(vendorId: number, country: string) { return this.http.get<TypeOfValve[]>(
        this.baseUrl + 'vendor/fullProducts/' + vendorId  + '/' + country); }

}
