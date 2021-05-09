import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GraphItem } from '../_models/graphItem';



@Injectable()
export class GraphService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {  }

    getAortic(id: number) {return this.http.get<GraphItem[]>(this.baseUrl + 'users/' + id + '/graph/1'); }
    getMitral(id: number) {return this.http.get<GraphItem[]>(this.baseUrl + 'users/' + id + '/graph/2'); }
    getRings(id: number) {return this.http.get<GraphItem[]>(this.baseUrl + 'users/' + id + '/graph/3'); }
    getConduits(id: number) {return this.http.get<GraphItem[]>(this.baseUrl + 'users/' + id + '/graph/4'); }
    
   }
