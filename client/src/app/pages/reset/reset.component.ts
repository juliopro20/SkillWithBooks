import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export default class ResetComponent implements OnInit  {
  

  resetForm!: FormGroup;
  fb = inject(FormBuilder)
  activatedRoute = inject(ActivatedRoute)//used to get the token from the URL
  router = inject(Router)

  token!: string;
  authService = inject(AuthService); // Assuming AuthService is provided in the app module

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, 
    {
      //codes for password validations
      validator: confirmPasswordValidator('password', 'confirmPassword')
    });

    this.activatedRoute.params.subscribe((params: { [x: string]: string; }) => {
      this.token = params['token'];
    });
  }

  reset(){
    let resetObj = {
      token: this.token,
      password: this.resetForm.value.password
    }
    this.authService.resetPasswordService(resetObj)
    .subscribe({
      next: (res) => {
        alert("Password reset successful");
        this.resetForm.reset(); // Reset the form after successful submission
        this.router.navigate(['login']); // Redirect to login page
      },
      error: (err) => {
        alert("Error resetting password: " + err.error.message);
      }
    })
}

}
