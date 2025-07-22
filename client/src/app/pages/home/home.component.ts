// home.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/books.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export default class HomeComponent implements OnInit {
  private bookService = inject(BookService);
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = ''; // Initialize search term
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.bookService.getBook().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.books = response.data;
          this.filteredBooks = this.books; // Initialize with all books
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

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm; // Update search term
    if (this.searchTerm) {
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredBooks = this.books; // Show all books if search term is empty
    }
  }
}