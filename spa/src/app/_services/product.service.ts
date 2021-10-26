import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TypeOfValve } from '../_models/TypeOfValve';
import { valveSize } from '../_models/valveSize';

@Injectable()
export class ProductService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {  }

    getAllTypeOfValve(nameid?: any, pageNumber?: number, pageSize?: number) { return this.http.get<TypeOfValve[]>(this.baseUrl + 'products');}
    addProduct() { return this.http.get<TypeOfValve>(this.baseUrl + 'addProduct'); }
    getProductByProduct_code(pc:string){return this.http.get<TypeOfValve>(this.baseUrl + 'productByCode/' + pc); }
    getProductById(id: number) { return this.http.get<TypeOfValve>(this.baseUrl + 'productByValveTypeId/' + id); }
    saveDetails(p: TypeOfValve) { return this.http.post<string>(this.baseUrl + 'saveProductDetails', p, { responseType: 'text' as 'json' }); }
    deleteProduct(id: number) { return this.http.delete(this.baseUrl + 'deleteProduct/' + id); }
    deleteValveSize(id:number, vs: number){return this.http.delete<number>(this.baseUrl + 'deleteSize/' + id + '/' + vs)}
    getValveSizes(id: number){return this.http.get<valveSize[]>(this.baseUrl + 'getValveCodeSizes/' + id)}
    addValveSize   (id:number, vs: valveSize){return this.http.post<valveSize>(this.baseUrl + 'addSize/' + id, vs)}
    getProductsByVTP(v: number, t: string, p: string){ return this.http.get<TypeOfValve[]>(this.baseUrl + 'productsByVTP/' + v + '/' + t + '/' + p); }

}
