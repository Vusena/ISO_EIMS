import { Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  title:any;
  description:any;
  selectedNotification:any;
  showLateDeclarationUI;
  declaration:FormGroup

  constructor(private modalService: NgbModal, private httpService: HttpService,private fb: FormBuilder) { }

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
    const notificationDateArray = notification.date;    
    const notificationDate = new Date(notificationDateArray[0], notificationDateArray[1] - 1, notificationDateArray[2]);
        console.log(notificationDate)
        console.log("today", today)
  if (notificationDate > today) {
    // Show the late declaration UI elements
    this.showLateDeclarationUI = true;
  } else {
    this.showLateDeclarationUI = false;
  }
    
  }
  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }
  onNoConflictClick(nocontent: TemplateRef<any>): void {
    this.modalService.dismissAll();
    this.modalService.open(nocontent, { centered: true, })

  }
  onConflictClick(yescontent: TemplateRef<any>): void {
    this.modalService.dismissAll();
    this.modalService.open(yescontent, { centered: true, }) 
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
  submitDeclarations():void{
    this.httpService.get(ApiEndPoints.DECLARATION_POST).subscribe({
      next: (response) => {
       console.log(response)        
      },
      error: (error) => {
        console.error("There was an error!", error);
      },
    })
  }

  handleFileInput(files: FileList): void {
    if (files.length > 0) {
      // If only one file is allowed, use the first file in the list
      const file = files.item(0);
      this.declaration.get('file').setValue(file);
    }

  }
}
