import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {

  user: User | null = null;

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    await this.getLoggedInUser();
  }

  getLoggedInUser(): void {
    this.authService
      .getUserProfile(this.authService.getLoggedInUserId())
      .subscribe((user) => {
        this.user = user;
      });
  }
}
