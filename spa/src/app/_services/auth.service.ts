import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { HospitalService } from './hospital.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  baseUrl = environment.apiUrl;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  
  Hospital = new BehaviorSubject<string>('0');
  currentHospital = this.Hospital.asObservable();

  Country = new BehaviorSubject<string>('0');
  currentCountry = this.Hospital.asObservable();

  SerialNumber = new BehaviorSubject<string>('');
  currentSerial = this.SerialNumber.asObservable();



constructor(private http: HttpClient, private userService: UserService, private hos:HospitalService) { }

changeCurrentHospital(sh: string) { this.Hospital.next(sh); }
changeCurrentSerial(sh: string) { this.SerialNumber.next(sh); }
changeCurrentCountry(sh: string) { this.Country.next(sh); }

login(model: any) {
    return this.http.post(this.baseUrl + 'auth/login', model).pipe(
        map((response: any) => {
            const r = response;
            if (releaseEvents) {
                localStorage.setItem('token', r.token);
                this.decodedToken = this.jwtHelper.decodeToken(r.token);
                this.getHospitalDetails();
                console.log(this.decodedToken);
            }
        })
    );
}




register(model: any) { return this.http.post(this.baseUrl + 'auth/register', model); }
update(model: any) { return this.http.put(this.baseUrl + 'auth/update', model, { responseType: 'text' as 'json' }); }

loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
}

getHospitalDetails(){
this.hos.getDetails().subscribe((next)=>{
    this.changeCurrentHospital(next.HospitalName);
})
}

}
