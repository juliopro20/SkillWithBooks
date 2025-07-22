import { Component, inject, Output, EventEmitter } from '@angular/core';
import {RouterModule, Router } from '@angular/router'
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  constructor(private router: Router) {};
 searchTerm: string = '';

  @Output() searchTermChange = new EventEmitter<string>(); // Create an event emitter

  onSearch(): void {
    this.searchTermChange.emit(this.searchTerm); // Emit the search term
  }


  isLoggedIn(): boolean {
    return (this.router.url === '/home' || this.router.url === '/profile');
  }
  logout() {
    localStorage.removeItem('authToken'); // Clear the token from local storage
    this.router.navigate(['/login']); // Redirect to login page
  }

  toTop() {
    scrollTo(0,0)
  }

}
