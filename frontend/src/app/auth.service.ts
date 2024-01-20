import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user';
import { Endpoints } from './constants/endpoints';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = {};

  constructor(private http: HttpClient, public router: Router) {}

  signUp(user: User): Observable<any> {
    let api = Endpoints.domain + '/users/signup';

    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  login(username: any, password: any) {
    const user = { username: username, password: password };

    const httpOptions: { headers: any; observe: any } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response',
    };

    return this.http
      .post<any>(Endpoints.domain + '/user-login', user, httpOptions)
      .pipe(
        map((event) => {
          if (event.type == HttpEventType.Response) {
            let user = event.body;

            this.setLoggedInUerId(user.userId);

            return user;
          }
        }),
        catchError(this.handleError)
      );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  setToken(token: any) {
    return localStorage.setItem('access_token', token);
  }

  setLoggedInUerId(userId: any) {
    return localStorage.setItem('logged_in_user_id', userId);
  }

  getLoggedInUserId(): number | 0 {
    return Number(localStorage.getItem('logged_in_user_id'));
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');

    return authToken !== null ? true : false;
  }

  logout() {
    let removeToken = localStorage.removeItem('access_token');

    if (removeToken == null) {
      this.router.navigateByUrl('/login');
    }
  }

  getUserProfile(id: any): Observable<any> {
    let api = Endpoints.domain + '/users/' + id;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.getToken(),
    });

    return this.http
      .get(api, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    console.log(error.status);
    if (error.status === 403) {
      console.log('Vale kasutajanimi ja parool');
    } else {
      console.log('Viga: ' + error.status + ', vea sisu on: ' + error.statusText);
    }

    return throwError(() => new Error('Midagi juhtus. Palun proovige uuesti'));
  }
}
