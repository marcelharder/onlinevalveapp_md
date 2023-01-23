import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ExpiringProducts } from '../_models/ExpiringProducts';
import { ValveService } from '../_services/valve.service';


@Injectable()
export class ExpiringProductsResolver implements Resolve<ExpiringProducts[]> {
    constructor(
                private router: Router,
                private valveService: ValveService,
                private alertify: AlertifyService,
       ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ExpiringProducts[]> {

            return this.valveService.getValveExpiry(+route.paramMap.get('id')).pipe(catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/home']);
                return of(null);
            }));
        }
}
