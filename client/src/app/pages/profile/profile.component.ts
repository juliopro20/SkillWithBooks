import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../models/users.models';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);

  userId: string = '';
  user!: User;

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params['id'];

    if (this.userId) {
      this.userService.getById(this.userId).subscribe(
        data => {
          this.user = data;
        },
        error => {
          console.error('Error fetching user data: ', error);
        }
      );
    }
  }
}