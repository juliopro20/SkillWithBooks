import { Component, inject, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/books.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookDataService } from '../../services/book-data.service'; // Import the new service

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export default class HomeComponent implements OnInit {
  private bookService = inject(BookService);
  private bookDataService = inject(BookDataService); // Inject the data service
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.bookService.getBook().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.books = response.data;
          this.filteredBooks = this.books;
          this.errorMessage = null;
        } else {
          console.warn('API response did not contain an array under the "data" property:', response);
          this.errorMessage = 'Unexpected data format received from server.';
          this.books = [];
        }
      },
      error => {
        console.error('Error fetching books: ', error);
        this.errorMessage = 'Failed to load books. Please try again later.';
        this.books = [];
      }
    );
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredBooks = this.books; // Show all books if search term is empty
    }
  }

  markAsRead(book: Book): void {
    this.bookDataService.addBook(book); // Add the book to the read list
  }
}