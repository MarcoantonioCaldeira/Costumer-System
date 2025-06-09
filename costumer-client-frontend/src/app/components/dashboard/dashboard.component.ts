import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {
  userName = 'User';
  isLoadingProfile = true;
  profileError: string | null = null;
  isOnHomePage = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.watchRoute();
  }

  private loadUserProfile(): void {
    this.isLoadingProfile = true;
    this.profileError = null;

    this.userService.getUserProfile().subscribe({
      next: (u: User) => {
        this.userName = u.name || 'User';
        this.isLoadingProfile = false;
      },
      error: () => {
        this.profileError = 'Error loading profile. Please try again.';
        this.isLoadingProfile = false;
      }
    });
  }

  private watchRoute(): void {
    this.isOnHomePage = this.router.url === '/dashboard';

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isOnHomePage = e.urlAfterRedirects === '/dashboard';
      });
  }
}
