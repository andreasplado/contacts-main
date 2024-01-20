import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  contacts: Contact[] = [];
  user: User | null = null;
  haveSession : boolean = false;

  constructor(private contactService: ContactService, private authService: AuthService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    await this.getContacts();
    await this.getLoogedInUser();
  }

  ngDoCheck() : void{
    this.haveSession = this.authService.getToken() == null;
    if(this.haveSession){
      this.router.navigateByUrl('/login')
    }
  }


  getContacts(): void {
    this.contactService.getUserContacts()
      .subscribe(contacts => this.contacts = contacts.slice(0, 5));
  }

  getLoogedInUser(): void {
    this.authService.getUserProfile(this.authService.getLoggedInUserId())
      .subscribe(user => this.user = user);
  }
}
