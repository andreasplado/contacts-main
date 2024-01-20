import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLogoutVisible: boolean = false;
  isUsernameEntered: boolean = false;
  isPasswordEntered: boolean = true;
  isAllCrednentialsEntered: boolean = false;
  posted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  isLoggedIn: boolean = false;
  loginForm = this.formBuilder.group({
    username: '',
    password: '',
  });

  login() {
    this.posted = true;
    if (this.loginForm.valid) {
      var username = this.loginForm.value.username;
      var password = this.loginForm.value.password;
      if (username?.length == 0) {
        this.isUsernameEntered = false;
      } else if (password?.length == 0) {
        this.isPasswordEntered = false;
      } else if (username?.length == 0 && password?.length == 0) {
        this.isAllCrednentialsEntered = false;
      } else {
        this.authService.login(username, password).subscribe((resp) => {
          this.loginForm.reset();
          this.authService.setToken(resp.token);
          this.authService.setLoggedInUerId(resp.userId);
          console.log(resp);
          this.isLoggedIn = true;
          this.router.navigateByUrl('/dashboard');
        });
      }
    }
  }

  get passwordFormField() {
    return this.loginForm.get('password');
  }
  get usernameFormField() {
    return this.loginForm.get('username');
  }
}
