import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  imports: [],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export default class LandingpageComponent {
  private router = inject(Router);
  moveToLogin() {
    this.router.navigate(['/login']);
  }
}
