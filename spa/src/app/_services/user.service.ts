import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_models/User';
import { EmailMessage } from '../_models/EmailMessage';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { DropItem } from '../_models/dropItem';
import { TypeOfValve } from '../_models/TypeOfValve';

@Injectable()
export class UserService {
    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }

    getUser(id: number) { return this.http.get<User>(this.baseUrl + 'userById/' + id); }
    addUser(id: number) { return this.http.get<User>(this.baseUrl + 'adduser/' + id);  }
    getUserIdFromName(name:string) { return this.http.get<number>(this.baseUrl + 'getUserIdFromName/' + name);  }
    getUsers(id: number, page?: number, itemsPerPage?: number ) {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page.toString());
            params = params.append('pageSize', itemsPerPage.toString());
        }
        return this.http.get<User[]>(this.baseUrl + 'users',{ observe: 'response', params } )
        .pipe(
            map(response => {
                paginatedResult.result = response.body;
                if (response.headers.get('Pagination') !== null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')); }
                return paginatedResult;
            }));
    }
   
    saveUser(userId: number, item: User) { return this.http.post(this.baseUrl + 'updateuser/' + userId, item); }
    deleteUser(id: number){return this.http.delete(this.baseUrl + 'deleteuser/' + id, {responseType: 'text' as 'json'})}
    
    getCountries(){return this.http.get<DropItem[]>(this.baseUrl + 'countries');}

    getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
        const paginatedResult: PaginatedResult<EmailMessage[]> = new PaginatedResult<EmailMessage[]>();
        let params = new HttpParams();
        params = params.append('MessageContainer', messageContainer);
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }
        return this.http.get<EmailMessage[]>(this.baseUrl + 'users/' + id + '/messages', { observe: 'response', params })
            .pipe(
                map(response => {
                    paginatedResult.result = response.body;
                    if (response.headers.get('Pagination') !== null) { paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')); }
                    return paginatedResult;
                }));
    }
    // tslint:disable-next-line: max-line-length
    getMessageThread(id: number, recipientId: number) { return this.http.get<EmailMessage[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId); }
    sendMessage(id: number, message: EmailMessage) {
        return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
    }
    deleteMessage(id: number, userId: number) {
        return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
    }
    markAsRead(userId: number, messageId: number) {
        return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {}).subscribe();
    }
    getMessage(userId: number, messageId: number) {
        return this.http.get<EmailMessage>(this.baseUrl + 'users/' + userId + '/messages/' + messageId);
    }
    createMessage(userId: number) {
        return this.http.get<EmailMessage>(this.baseUrl + 'users/' + userId + '/createMessage');
    }
    deletePhoto(userId: number, id: number) { return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id, {});
    }
    setMainPhoto(userId: number, id: number) {
        return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
     }
    getCurrentCountryCode(id: number){return this.http.get<string>(this.baseUrl + 'currentCountryCode/' + id, { responseType: 'text' as 'json' } );}

    getListOfUsersInHospital(id: number, selectedHospital: number, page?: number, itemsPerPage?: number ) {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page.toString());
            params = params.append('selectedHospital', selectedHospital.toString());
            params = params.append('pageSize', itemsPerPage.toString());
        }
        return this.http.get<User[]>(this.baseUrl + 'usersInHospital',{ observe: 'response', params } )
        .pipe(
            map(response => {
                paginatedResult.result = response.body;
                if (response.headers.get('Pagination') !== null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')); }
                return paginatedResult;
            }));
    }

}
