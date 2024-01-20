import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  posted: boolean = false;
  addUserForm = this.formBuilder.group({
    username: '',
    password: '',
  });

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private formBuilder: FormBuilder
  ) {}

  onSubmit(): void {
    this.posted = true;
    if (this.addUserForm.valid) {
      var user = this.addUserForm.value;
      if (user.password === '' && user.username === '') {
      } else if (user.password === '') {
      } else if (user.username === '') {
      } else {
        this.registerService.signup(user).subscribe((response) => {
          console.log(response);
          this.addUserForm.reset();
          this.router.navigateByUrl('/login');
        });
      }
    } else {
      alert("Vorm ei ole valiidne");
    }
  }
}
