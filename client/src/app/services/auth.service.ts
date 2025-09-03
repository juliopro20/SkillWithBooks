// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Observable, of } from 'rxjs'; // Added 'of' for synchronous isLoggedIn example
import { tap, catchError, map } from 'rxjs/operators'; // Added map, tap, catchError

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  private authTokenKey = 'authToken'; 

  registerService(registerObj: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.AuthService}register`, registerObj);
  }

  loginService(loginObj: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.AuthService}login`, loginObj).pipe(
        tap((response: any) => {
            console.log('Login response:', response);
            if (response && response.token) {
                this.storeAuthToken(response.token); // Store the token
            }
        }),
        catchError((error) => {
            console.error('Login error:', error);
            return of(null);
        })
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.authTokenKey); // Retrieve token from local storage
    return !!token && !this.isTokenExpired(token); // Check if token exists and is not expired
}

private isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    // Check if the token has expired
    return decodedToken.exp * 1000 < Date.now(); // Convert exp to milliseconds
}

private decodeToken(token: string): any {
    return JSON.parse(atob(token.split('.')[1])); // Decode JWT token
}

  private storeAuthToken(token: string): void {
  localStorage.setItem(this.authTokenKey, token);
}

getUserId(): string | null {
  const token = localStorage.getItem(this.authTokenKey); // Updated to use authTokenKey
  if (token) {
    const payload = this.decodeToken(token);
    return payload.id; // Ensure this matches your token structure
  }
  return null;
}

  sendEmailService(email: string): Observable<any> { // Changed email to string type
    return this.http.post<any>(`${apiUrls.AuthService}send-email`, { email: email });
  }

  resetPasswordService(resetObj: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.AuthService}reset-password`, resetObj);
  }
  
  logout(): void {
    localStorage.removeItem(this.authTokenKey);
  }
}