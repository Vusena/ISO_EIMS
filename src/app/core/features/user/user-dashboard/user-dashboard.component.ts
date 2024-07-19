import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild('nocontent') nocontent: TemplateRef<any>;

  notifications: any[] = [];
  headers: any;
  title: any;
  description: any;
  selectedNotification: any;
  showLateDeclarationUI: boolean;
  declarationForm: FormGroup;
  conflictOfInterest: any;
  conflictOfInterestControl = new FormControl(null);
  assignmentId: number;
  date: any;

  constructor(private modalService: NgbModal, private httpService: HttpService, private fb: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getNotifications();
    this.preselectNoButton();
     this.declarationForm = this.fb.group({
      file: ['',],
      identityNo: ['',],
      description: ['',],
      reasons: ['',]
    })     
  }

  openVerticallyCentered(content: TemplateRef<any>, notification: any) {
    this.modalService.open(content, { centered: true, });
    this.selectedNotification = notification;
    this.assignmentId = notification.assignmentId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const notificationDateArray = notification.date;
    const notificationDate = new Date(notificationDateArray[0], notificationDateArray[1] - 1, notificationDateArray[2]);    
    this.date=notificationDate
    if (notificationDate < today) {
      this.showLateDeclarationUI = true;       
       this.declarationForm = this.fb.group({
        file: ['',Validators.required],
        identityNo: ['', ],
        description: ['',],
        reasons: ['',Validators.required]
      })
    } else {
      this.showLateDeclarationUI = false;
    }
    this.preselectNoButton();
    
  }

  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }

  onNoConflictClick(): void {
    // this.modalService.dismissAll();
    // this.modalService.open(nocontent, { centered: true, })    
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    if (noButton && yesButton) {
      noButton.classList.add('selected');
      yesButton.classList.remove('selected');
    }
    this.conflictOfInterestControl.setValue(0);
  }
  noConflictClick(content: TemplateRef<any>): void {
    this.modalService.dismissAll();
    this.modalService.open(content, { centered: true, })
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    if (noButton && yesButton) {
      noButton.classList.add('selected');
      yesButton.classList.remove('selected');
    }
    this.conflictOfInterestControl.setValue(0);
  }

  onConflictClick(yescontent: TemplateRef<any>): void {
    this.modalService.dismissAll();
    this.modalService.open(yescontent, { centered: true, })
    this.conflictOfInterest = 1;
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    if (noButton && yesButton) {
      yesButton.classList.add('selected');
      noButton.classList.remove('selected');
    }
    this.conflictOfInterestControl.setValue(1);
    this.preselectYesButton();
    this.declarationForm = this.fb.group({
      file: ['',],
      identityNo: ['', Validators.required],
      description: ['', Validators.required],
      reasons: ['',]
    })
    // console.log(this.date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (this.date < today) {
      this.showLateDeclarationUI = true;       
       this.declarationForm = this.fb.group({
        file: ['',Validators.required],
        identityNo: ['',Validators.required ],
        description: ['',Validators.required],
        reasons: ['',Validators.required]
      })
    }     
  }

  yesConflictClick(): void {
    this.conflictOfInterestControl.setValue(1);
  }

  preselectNoButton(): void {
    const noButton = document.getElementById('noButton');
    if (noButton) {
      noButton.classList.add('selected');
    }
  }
  preselectYesButton(): void {
    const ybutton = document.getElementById('ybutton');
    if (ybutton) {
      ybutton.classList.add('selected');
    }
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
    let haveConflict = 0;
    const formData = new FormData();
    if (this.conflictOfInterestControl.value !== null && this.conflictOfInterestControl.value !== undefined) {
      haveConflict = this.conflictOfInterestControl.value;
    }
    if (this.assignmentId) {
      const declaration = {
        assignmentId: this.assignmentId,
        identityNo: this.declarationForm.get('identityNo').value,
        haveConflict: haveConflict,
        description: this.declarationForm.get('description').value,
        reasons: this.declarationForm.get('reasons').value
      };
      // console.log(declaration)
      formData.append('declaration', JSON.stringify(declaration));
      formData.append('file', this.declarationForm.get('file').value);
      this.httpService.postData(`${ApiEndPoints.DECLARATION_POST}`, formData,).subscribe({
        next: (response) => {
          // console.log(response)
          this.modalService.dismissAll();
          // this.declarationForm.reset()
          this.openSuccessModal(this.nocontent)

        },
        error: (error) => {
          console.error("There was an error!", error);
        },
      })
    } 
    console.log(this.declarationForm)  
  }

  cancelDeclarations(): void { 
    this.declarationForm.reset();   
    this.declarationForm.patchValue({
      description: '',
      file: '',
      identityNo: '',
      reasons: ''
    });
   
  }
  
  handleFileInput(files: FileList): void {
    if (files.length > 0) {
      // If only one file is allowed, use the first file in the list
      const file = files.item(0);
      this.declarationForm.get('file').setValue(file);
    }
  }
  openSuccessModal(nocontent: TemplateRef<any>) {
    this.modalService.open(nocontent, { centered: true });
  }
}
