import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../../app/validators/confirm-password.validator';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export default class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        userName: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: confirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  register(): void {
    this.errorMessage = null; 
    this.successMessage = null;

    if (this.registerForm.valid) {
      const { confirmPassword, ...registerObj } = this.registerForm.value;

      this.authService.registerService(registerObj).pipe(
        catchError((error) => {
          this.handleError(error);
          return of(null);
        })
      ).subscribe((response) => {
        if (response) {
          this.successMessage = 'Registration successful! You can now log in.';
          this.registerForm.reset();
          this.router.navigate(['login']);
          alert(this.successMessage);
        }
      });
    } else {
      this.errorMessage = 'Please fix the form errors before submitting.';
      alert(this.errorMessage);
    }
  }

  private handleError(error: any): void {
    this.errorMessage = error.error?.message || 'An unexpected error occurred. Please try again.';
    alert(this.errorMessage); // Notify the user of the error
  }
}