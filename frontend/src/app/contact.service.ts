import { Injectable } from '@angular/core';

import { Observable, catchError, of, retry, throwError } from 'rxjs';
import { Contact } from './contact';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Endpoints } from './constants/endpoints';

@Injectable({ providedIn: 'root' })
export class ContactService {
  contacts: any;
  contact: any;
  pageSize: number = 10;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getContacts(currentPage: number): Observable<Contact[]> {
    let url: string =
      Endpoints.domain +
      '/contact/all/user/' +
      this.authService.getLoggedInUserId();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    });

    return this.http.get<Contact[]>(url, {
      params: new HttpParams()
        .set('pageSize', this.pageSize)
        .set('pageNo', currentPage),
      headers: headers,
    });
  }

  getAllContacts(): Observable<Contact[]> {
    let url: string = Endpoints.domain + '/contact/few';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    });

    return this.http.get<Contact[]>(url, { headers: headers }).pipe(retry(3));
  }

  getUserContacts(): Observable<Contact[]> {
    let url: string =
      Endpoints.domain +
      '/contact/all/user/' +
      this.authService.getLoggedInUserId();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken()
    });

    return this.http.get<Contact[]>(url, { headers: headers });
  }

  getContact(id: number): Observable<Contact> {
    let url: string = Endpoints.domain + '/contact/' + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    });

    return this.http.get<Contact>(url, { headers: headers }).pipe(retry(3));
  }

  getContactBySearch(contactSearch: any): Observable<Contact[]> {
    let url: string = '';
    let userId: number | 0 = this.authService.getLoggedInUserId();
    if (userId != 0) {
      let userIdConverted: number = userId;
      url =
        Endpoints.domain +
        '/contact/get/' + userId + '?name=' +
        contactSearch.name
        ;
    }
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    });

    return this.http.get<Contact[]>(url, { headers: headers });
  }

  addVideo(contact: any): Observable<Contact> {
    let url: string = Endpoints.domain + '/contact/';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    });

    this.http.post(url, contact, { headers: headers }).subscribe(() => {});

    return of(contact);
  }

  updateContact(id: number, contact: Contact): Observable<Contact> {
    let url: string = Endpoints.domain + '/contact/' + id;

    contact.id = id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    });

    this.http.put(url, contact, { headers: headers }).subscribe(() => {});

    return of(contact);
  }

  deleteContact(id: number): Observable<Contact> {
    let url: string = Endpoints.domain + '/contact/' + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    });

    this.http
      .delete(url, { headers: headers })
      .pipe(catchError(this.handleError))
      .subscribe((data) => {
        this.contact = data;
      });

    return of(this.contact);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Viga: ', error.error);
    } else {
      console.error(
        'Backend tagastas vea: ' + error.status + ' Sisu: ' + error.error
      );
    }
    return throwError(() => new Error('Midagi juhtus. Palun proovige uuesti.'));
  }
}
