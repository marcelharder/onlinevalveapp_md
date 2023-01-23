import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { catchError } from 'rxjs/operators';
import { Vendor } from '../_models/Vendor';
import { VendorService } from '../_services/vendor.service';



@Injectable()
export class ListVendorsResolver implements Resolve<Vendor[]> {
    pageSize = 6;
    pageNumber = 1;
    messageContainer = 'Unread';
    constructor(private vendorService: VendorService,
        private router: Router,
        private alertify: AlertifyService,
        private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Vendor[]> {
        return this.vendorService.getVendorsFull(this.authService.decodedToken.nameid,
            this.pageNumber,
            this.pageSize).pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving data');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );

    }
}