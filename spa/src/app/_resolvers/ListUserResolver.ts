import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/User';


@Injectable()
export class ListUserResolver implements Resolve<User[]> {
    pageSize = 7;
    pageNumber = 1;
    messageContainer = 'Unread';
    constructor(private userService: UserService,
        private router: Router,
        private alertify: AlertifyService,
        private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.authService.decodedToken.nameid,
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