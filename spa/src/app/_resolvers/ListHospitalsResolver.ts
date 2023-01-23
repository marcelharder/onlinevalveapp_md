import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Hospital } from "../_models/Hospital";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";
import { HospitalService } from "../_services/hospital.service";

@Injectable()
export class ListHospitalsResolver implements Resolve<Hospital[]> {
    pageSize = 8;
    pageNumber = 1;
    constructor(private hospitalService: HospitalService,
        private router: Router,
        private alertify: AlertifyService,
        ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Hospital[]> {
        return this.hospitalService.getListOfFullHospitalsPerCountry("31", this.pageNumber, this.pageSize).pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving data');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );

    }
}