import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/users.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getById(id: string): Observable<{ success: boolean; data: User }> {
    const token = localStorage.getItem('authToken'); // Use the same key you used to store the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Include the token in the headers
    });

    return this.http.get<{ success: boolean; data: User }>(`http://localhost:3000/api/user/${id}`, { headers }).pipe(
      map(response => response) // Extracting the whole response
    );
  }
}