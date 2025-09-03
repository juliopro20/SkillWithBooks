import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router); // Inject Router
  searchTerm: string = '';

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Check if the user is logged in
  }

  logout(): void {
    this.authService.logout(); // Handle logout
    this.router.navigate(['/login']); // Navigate to the login page
  }

  getUserId(): string | null {
    return this.authService.getUserId(); // Get user ID from token
  }

 
}