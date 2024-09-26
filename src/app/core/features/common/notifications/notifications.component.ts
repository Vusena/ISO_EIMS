import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
import { HttpService } from 'app/core/services/http.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
    // notifications: any[] = [] 


  test:string="it works"

   notifications :any= [
    {
      id: 1,
      header: "Task Due",
      title: "Complete Profile Setup",
      description: "Please complete your profile setup by tomorrow."
    },
    {
      id: 2,
      header: "Reminder",
      title: "Meeting at 3 PM",
      description: "You have a scheduled meeting at 3 PM today."
    },
    {
      id: 3,
      header: "Alert",
      title: "Password Expiring Soon",
      description: "Your password will expire in 3 days. Please update it."
    },
    {
      id: 4,
      header: "Notification",
      title: "New Message Received",
      description: "You have received a new message from HR."
    },
    {
      id: 5,
      header: "Update",
      title: "System Maintenance",
      description: "The system will undergo maintenance tonight from 12 AM to 2 AM."
    }
  ];
  

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  }
}
