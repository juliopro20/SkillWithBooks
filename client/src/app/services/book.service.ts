import { Injectable, inject } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import {Book} from '../models/books.models';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  
  getBook() {
    return this.http.get<Book[]>('http://localhost:3000/api/book')
  }
  
}

