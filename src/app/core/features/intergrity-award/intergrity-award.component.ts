import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ApiEndPoints } from '../../common/ApiEndPoints';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuccessComponent } from '../common/success/success.component';
import { TabsComponent } from '../../features/admin/tabs/tabs.component'
import { AuthService } from 'app/core/services/auth.service';
import { NotificationService } from 'app/core/services/notification.service';

@Component({
  selector: 'app-intergrity-award',
  templateUrl: './intergrity-award.component.html',
  styleUrl: './intergrity-award.component.scss'
})


export class IntergrityAwardComponent {

  ngOnInit(): void {
    this.notificationService.getNotifications();  
     }

  constructor(private httpService: HttpService, private fb: FormBuilder, private dialog: MatDialog,
    private authService: AuthService, private notificationService: NotificationService ) { }  

  isAdmin(): boolean {
    // Check if the user has 'admin' role
    const userRoles = this.authService.getUserRoles();
    return userRoles.includes('ROLE_ADMIN');
  }
  isUser(): boolean {
    const userRoles = this.authService.getUserRoles();
    return userRoles.includes('ROLE_USER');
  }
}







