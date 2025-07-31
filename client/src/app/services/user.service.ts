import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/users.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}
  
  getById(id: string): Observable<User> {
    return this.http.get<{ success: boolean; data: User }>(`http://localhost:3000/api/user/${id}`).pipe(
      map(response => response.data) // Extracting the user data from the response
    );
  }
}