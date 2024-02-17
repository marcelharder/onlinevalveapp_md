import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { catchError } from 'rxjs/operators';
import { TypeOfValve } from '../_models/TypeOfValve';
import { ProductService } from '../_services/product.service';


@Injectable()
export class ListProductsResolver implements Resolve<TypeOfValve[]> {
   
    constructor(private productService: ProductService,
        private router: Router,
        private alertify: AlertifyService,
        private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<TypeOfValve[]> {
        return this.productService.getAllTypeOfValve().pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving data');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );

    }
}