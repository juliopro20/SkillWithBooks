import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FooterComponent],
})
export default class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
        this.authService.loginService(this.loginForm.value).pipe(
            catchError((error) => {
                this.handleError(error);
                return of(null);
            })
        ).subscribe((response) => {
            if (response) {
                console.log('Login successful, navigating to home...');
                alert('Login successful!');
                this.router.navigate(['/home']).then(success => {
                if (success) {
                console.log('Navigation to home successful');
               } else {
            console.error('Navigation to home failed');
          }
    });
}
        });
    } else {
        this.errorMessage = 'Please enter valid email and password.';
    }
  }

  private handleError(error: any): void {
    this.errorMessage = error.error?.message || 'An unexpected error occurred. Please try again.';
  }
}