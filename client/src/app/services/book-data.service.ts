import { Injectable } from '@angular/core';
import { Book } from '../models/books.models';

@Injectable({
  providedIn: 'root'
})
export class BookDataService {
  private readBooks: Book[] = [];

  addBook(book: Book): void {
    // Check if the book is already in the list
    if (!this.readBooks.find(b => b.isbn13 === book.isbn13)) {
      this.readBooks.push(book);
    }
  }

  getBooks(): Book[] {
    return this.readBooks;
  }

  deleteBook(index: number): void {
    this.readBooks.splice(index, 1);
  }
}