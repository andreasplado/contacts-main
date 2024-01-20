import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'contacts-app-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css'],
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | undefined;
  haveSession: boolean = false;
  password: any;
  showingSecret: boolean = false;

  updateContactForm = this.formBuilder.group({
    id: Number(this.route.snapshot.paramMap.get('id')),
    name: '',
    code: '',
    phone: '',
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contactService: ContactService,
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.haveSession = authService.getToken() == null;
    if (this.haveSession) {
      this.router.navigateByUrl('/login');
    }
  }

  getContact(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.contactService.getContact(id).subscribe((response: Contact) => {
      this.contact = response;
    });
  }

  goBack(): void {
    this.location.back();
  }

  deleteContact(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.contactService.deleteContact(id).subscribe((response: Contact) => {
      this.contact = response;
      this.router.navigateByUrl('/contacts');
    });
  }

  updateContact(): void {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    let userId = this.authService.getLoggedInUserId();
    console.log(userId);

    if (this.updateContactForm.valid) {
      let contactValues = this.updateContactForm.value;
      let contact : Contact = {
        id:id,
        userid: userId,
        name: String(contactValues.name),
        code: String(contactValues.code),
        phone: String(contactValues.phone)
      }
      console.log(contact);

      this.contactService.updateContact(id, contact).subscribe(() => {
        this.updateContactForm.reset();
        this.router.navigateByUrl('/contacts');
      });
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

  ngOnInit(): void {
    this.getContact();
    this.password = 'password';
  }
}
