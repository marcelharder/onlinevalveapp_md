import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { EmailMessage } from '../_models/EmailMessage';
import { AuthService } from '../_services/auth.service';
import { catchError } from 'rxjs/operators';


@Injectable()
export class MessagesResolver implements Resolve<EmailMessage[]> {
    pageSize = 5;
    pageNumber = 1;
    messageContainer = 'Unread';
    constructor(private userService: UserService,
        private router: Router,
        private alertify: AlertifyService,
        private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<EmailMessage[]> {
        return this.userService.getMessages(this.authService.decodedToken.nameid,
            this.pageNumber,
            this.pageSize,
            this.messageContainer).pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving data');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );

    }
}