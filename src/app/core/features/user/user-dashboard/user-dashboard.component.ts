import { Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
import { HttpService } from 'app/core/services/http.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserDashboardComponent {

  notifications: any[] = [];
  headers: any;
  title: any;
  description: any;
  selectedNotification: any;
  showLateDeclarationUI: boolean;
  declaration: FormGroup;
  conflictOfInterest: any;
  conflictOfInterestControl = new FormControl(null);

  constructor(private modalService: NgbModal, private httpService: HttpService, private fb: FormBuilder, 
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getNotifications()
    this.declaration = this.fb.group({
      file: ['',],

    })
  }

  openVerticallyCentered(content: TemplateRef<any>, notification: any) {
    this.modalService.open(content, { centered: true, });
    this.selectedNotification = notification;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const notificationDateArray = notification.date;
    const notificationDate = new Date(notificationDateArray[0], notificationDateArray[1] - 1, notificationDateArray[2]);
    console.log(notificationDate)
    console.log("today", today)
    if (notificationDate < today) {
      this.showLateDeclarationUI = true;
    } else {
      this.showLateDeclarationUI = false;
    }

    console.log(this.showLateDeclarationUI);
  }

  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }

  onNoConflictClick(nocontent: TemplateRef<any>): void {
    this.modalService.dismissAll();
    // this.modalService.open(nocontent, { centered: true, })
    this.conflictOfInterest=true
  }
  onNoConflictClickk(): void {
    // this.modalService.dismissAll();
    // this.modalService.open(nocontent, { centered: true, })
    this.conflictOfInterest=0;
    const conflictValue = 0;
    console.log(conflictValue); // Output: 0
  }
  onConflictClick(yescontent: TemplateRef<any>): void {
    this.modalService.dismissAll();
    this.modalService.open(yescontent, { centered: true, })
    this.conflictOfInterest=1;
  }
  
  getNotifications(): void {
    this.httpService.get(ApiEndPoints.GET_NOTIFICATIONS).subscribe({
      next: (response) => {
        this.notifications = response.data

      },
      error: (error) => {
        console.error("There was an error!", error);
      },
    })
  }
  
  submitDeclarations(): void {
    const conflictOfInterestValue = this.conflictOfInterestControl.value;
    console.log("conflictOfInterestValue", conflictOfInterestValue)
    // this.httpService.post(ApiEndPoints.DECLARATION_POST, {
    //   conflictOfInterest: conflictOfInterestValue,
    
    // }).subscribe({
    //   next: (response) => {
    //     console.log(response)
    //   },
    //   error: (error) => {
    //     console.error("There was an error!", error);
    //   },
    // })

    this.snackBar.open(`Submit Button has been clicked.`, 'Close', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    
  }
  
  

  handleFileInput(files: FileList): void {
    if (files.length > 0) {
      // If only one file is allowed, use the first file in the list
      const file = files.item(0);
      this.declaration.get('file').setValue(file);
    }

  }
}
