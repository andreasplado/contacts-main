import { Component } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from '../contact';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { Endpoints } from '../constants/endpoints';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css'],
})
export class AddContactComponent {
  contact: Contact | undefined;
  haveSession: boolean = false;
  formIsValid: boolean = true;
  password: any;
  showingSecret: boolean = false;

  constructor(
    private router: Router,
    private contactService: ContactService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  addContactForm = this.formBuilder.group({
    name: '',
    userid: this.authService.getLoggedInUserId(),
    code: '',
    phone: '',
  });

  ngOnInit() {
    this.password = 'password';
  }

  ngAfterContentInit(): void {
    this.haveSession = this.authService.getToken() == null;
    if (this.haveSession) {
      this.router.navigateByUrl('/login');
    }
  }

  onSubmit(): void {
    let name = <HTMLInputElement>document.getElementById('name');
    let code = <HTMLInputElement>document.getElementById('code');
    let phone = <HTMLInputElement>document.getElementById('phone');

    if (
      name.value.length > 0 &&
      code.value.length > 0 &&
      phone.value.length > 0 &&
      this.addContactForm.valid
    ) {
      var contact = this.addContactForm.value;
      this.contactService.addContact(contact).subscribe((contact) => {
        this.addContactForm.reset();
        this.router.navigateByUrl('/contacts');
      });
    } else {
      this.formIsValid = false;
    }
  }
  ngOnChanges() {
    var contact = this.addContactForm.value;
    if (contact.code != null && contact.name != null && contact.phone != null) {
    } else {
    }
  }
  cryptSecretPhrase() {
    var contact = this.addContactForm.value;
    if (contact.code != null && contact.name != null && contact.phone != null) {
      var url =
        Endpoints.domain +
        '/contact/hash-secret?secret=' +
        contact.code +
        '&name=' +
        contact.name;
      window.open(url, '_blank');
    } else {
    }
  }

  showSecret() {
    if (this.password === 'password') {
      this.password = 'text';
      this.showingSecret = true;
    } else {
      this.password = 'password';
      this.showingSecret = false;
    }
  }
}
