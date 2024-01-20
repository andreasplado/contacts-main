import { Injectable } from '@angular/core';

import { Observable, catchError, of, retry, throwError } from 'rxjs';
import { Contact } from './contact';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { ContactSearch } from './contactSearch';
import { AuthService } from './auth.service';
import { User } from './user';
import { Endpoints } from './constants/endpoints';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  contacts: any;
  contact: any;

  constructor(private http: HttpClient) {}

  signup(user: any): Observable<any> {
    let responseFinal : any;
    this.http
      .post(Endpoints.domain + '/users/signup', user)
      .pipe(catchError(this.handleError))
      .subscribe((response) => {
        console.log(response);
        responseFinal = response;
      });

    if(responseFinal instanceof Response){
      return of(responseFinal);
    }else{
      return of(user);
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Viga: ', error.error);
    } else {
      console.error(
        'Backend tagastas vea: ' + error.status + ' Sisu: ' + error.error
      );
    }

    return throwError(() => new Error('Midagi juhtus. Palun proovige uuesti'));
  }
}
