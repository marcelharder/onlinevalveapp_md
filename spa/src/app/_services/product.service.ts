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
    getProductById(id: number) { return this.http.get<TypeOfValve>(this.baseUrl + 'productByNo/' + id); }
    // tslint:disable-next-line: max-line-length
    saveDetails(p: TypeOfValve) { return this.http.post<string>(this.baseUrl + 'saveProductDetails', p, { responseType: 'text' as 'json' }); }
    deleteProduct(id: number) { return this.http.delete(this.baseUrl + 'deleteProduct/' + id); }
    deleteValveSize(id:number, vs: number){
        return this.http.delete<number>(this.baseUrl + 'deleteSize/' + id + '/' + vs)}
    addValveSize   (id:number, vs: valveSize)
    {
        return this.http.post<valveSize>(this.baseUrl + 'addSize/' + id, vs)
    }

}
