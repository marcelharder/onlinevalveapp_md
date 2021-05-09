import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Vendor } from '../_models/Vendor';
import { DropItem } from '../_models/dropItem';
import { TypeOfValve } from '../_models/TypeOfValve';

@Injectable()
export class VendorService {
    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }

    getVendors() { return this.http.get<Vendor[]>(this.baseUrl + 'vendors'); }

    getVendor(id: number) { return this.http.get<Vendor>(this.baseUrl + 'vendor/' + id); }

    getVendorContactPerson(vendorId: number){ return this.http.get<number>(this.baseUrl + 'vendorContact/' + vendorId);}

    getProductByVendor(vendorId: number) { return this.http.get<DropItem[]>(this.baseUrl + 'vendor/valvecodes/' + vendorId); }
    
    getAllFullProducts(vendorId: number) { return this.http.get<TypeOfValve[]>(this.baseUrl + 'vendor/fullProducts/' + vendorId); }

}
