import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../models/users.models';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { BookDataService } from '../../services/book-data.service'; // Import the service
import { Book } from '../../models/books.models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);
  private bookDataService = inject(BookDataService); // Inject the book data service

  userId: string = '';
  user!: User;
  readBooks: Book[] = []; // Store read books

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params['id'];

    if (this.userId) {
      this.userService.getById(this.userId).subscribe(
        response => {
          if (response.success) {
            this.user = response.data;
          } else {
            console.error('Failed to fetch user data: ');
          }
        },
        error => {
          console.error('Error fetching user data: ', error);
        }
      );
    }

    this.readBooks = this.bookDataService.getBooks(); // Get read books from the service
  }

  deleteBook(index: number): void {
    this.bookDataService.deleteBook(index); // Remove the book from the service
    this.readBooks = this.bookDataService.getBooks(); // Refresh the list
  }
}