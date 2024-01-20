import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Kontaktid';
  token: any = '';
  haveSession: boolean = false;
  isLoggedIn: boolean = false;
  confirmLogout: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    if (authService.getToken() != '') {
      this.token = authService.getToken()?.toString();
      this.haveSession = true;
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  logOut() {
    if (this.authService.getToken() != null) {
      this.authService.logout();
      this.isLoggedIn = false;
    }
  }

  ngAfterViewChecked() {
    if (this.authService.getToken() != null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  get getToken() {
    return this.token;
  }
}
