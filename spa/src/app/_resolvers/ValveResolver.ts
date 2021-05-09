import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service'; import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { Valve } from '../_models/Valve';
import { ValveService } from '../_services/valve.service';

@Injectable()

export class ValveResolver implements Resolve<Valve> {
    constructor(private valveservice: ValveService,
                private router: Router,
                private auth: AuthService,
                private alertify: AlertifyService) {

    }
    resolve(route: ActivatedRouteSnapshot): Observable<Valve> {
        return this.valveservice.getNewValveBasedOnValveType(+route.paramMap.get('id')).pipe(catchError(error => {
            this.alertify.error('Problem retrieving data');
            this.router.navigate(['/home']);
            return of(null);
        }));
    }
}
