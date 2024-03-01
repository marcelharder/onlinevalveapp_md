import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Valve } from '../_models/Valve';
import { TypeOfValve } from '../_models/TypeOfValve';
import { ExpiringProducts } from '../_models/ExpiringProducts';
import { ValveTransfer } from '../_models/ValveTransfer';
import { modelValveParams } from '../_models/modelValveParams';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';
import { AlertifyService } from './alertify.service';
import { AuthService } from './auth.service';

@Injectable()
export class ValveService {
   

    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient, private alertify:AlertifyService, private auth: AuthService) { }

    getValves(soort: number, position: number) { return this.http.get<Valve[]>(this.baseUrl + 'valvesBySoort/' + soort + '/' + position); }
    getSuggestedValves(userId: string,v: modelValveParams, page?: number, itemsPerPage?: number) {
        const paginatedResult: PaginatedResult<Valve[]> = new PaginatedResult<Valve[]>();
        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page.toString());
            params = params.append('userId', userId);
            params = params.append('pageSize', itemsPerPage.toString());
            params = params.append('biopref', v.BioPref.toString());
            params = params.append('height', v.Height.toString());
            params = params.append('weight', v.Weight.toString());
            params = params.append('lifeStyle', v.LifeStyle.toString());
            params = params.append('soort', v.Soort.toString());
            params = params.append('position', v.Position.toString());
            params = params.append('size', v.Size.toString());
        }

        return this.http.get<Valve[]>(this.baseUrl + 'selectValves', { observe: 'response', params }).pipe(
            map(response => {
                paginatedResult.result = response.body;
                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                }
                return paginatedResult;
            }, (error)=>{this.alertify.error(error)})
        );
    }
    getAllAorticValves(id: number){return this.http.get<Valve[]>(this.baseUrl + 'getAllAorticValves/' + id);}
    getAllMitralValves(id: number){return this.http.get<Valve[]>(this.baseUrl + 'getAllMitralValves/' + id);}
    
    getValve(id: number) { return this.http.get<Valve>(this.baseUrl + 'valveById/' + id); }
    getValveType(id: number) { return this.http.get<TypeOfValve>(this.baseUrl + 'productByNo/' + id); }

    getValveBySerial(serial: string, who: string) { // if vendor => who = '1'
        return this.http.get<Valve>(this.baseUrl + 'valveBySerial/' + serial + '/requester/' + who);
    }

    getValveBasedOnValveCode(SelectedProduct: number) {
        return this.http.get<Valve>(this.baseUrl + 'valveBasedOnTypeOfValve/' + SelectedProduct);
    }

    saveValve(item: Valve) { return this.http.post(this.baseUrl + 'updatevalve', item, { responseType: 'text' as 'json' }); }
    deleteValve(id: number){ return this.http.delete<string>(this.baseUrl + 'deleteValve/' + id, { responseType: 'text' as 'json' })}
    
    getValvesByHospitalAndValveCodeId(hospital: number, code: number) { return this.http.get<Valve[]>(this.baseUrl + 'valvesByHospitalAndValveId/' + hospital + '/' + code); }
    getNewValveBasedOnValveType(id: number) { return this.http.get<Valve>(this.baseUrl + 'valveBasedOnTypeOfValve/' + id); }
    getValveExpiry(id: number) { return this.http.get<ExpiringProducts[]>(this.baseUrl + 'valveExpiry/' + id); }
    getValveTransfers(userId: number, id: number) { return this.http.get<ValveTransfer[]>(this.baseUrl + 'valveTransfers/' + userId + '/' + id) }
    getValveTransferDetails(userId: number, id: number) { return this.http.get<ValveTransfer>(this.baseUrl + 'valveTransferDetails/' + userId + '/' + id) }
    addValveTransferDetails(userId: number, valveId: number) { return this.http.post<ValveTransfer>(this.baseUrl + 'addValveTransfer/' + userId + '/' + valveId, {}) }
    updateValveTransferDetails(userId: number, ct: ValveTransfer) { return this.http.put<number>(this.baseUrl + 'updateValveTransfer/' + userId, ct) }
    removeValveTransfer(userId: number, transferId: number) { return this.http.delete<number>(this.baseUrl + 'removeValveTransfer/' + userId + "/" + transferId) }
    updateValveTypePhoto(photoUrl:string){return this.http.post<string>(this.baseUrl + 'updatePhoto', photoUrl) }

}
