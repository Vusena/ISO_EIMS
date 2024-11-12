import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  
  isAdmin(): boolean {
    // Check if the user has 'admin' role
    const userRoles = this.authService.getUserRoles();
    return userRoles.includes('ROLE_ADMIN');
  }
  isUser():boolean{
    const userRoles = this.authService.getUserRoles();
    return userRoles.includes('ROLE_USER');
  }
}
