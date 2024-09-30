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
  encapsulation: ViewEncapsulation.None,
 
})
export class UserDashboardComponent {
  @ViewChild('nocontent') nocontent: TemplateRef<any>;
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('colreview') colreview: TemplateRef<any>;
  @ViewChild('CoIISupReview') CoIISupReview: TemplateRef<any>;


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
  remarksForm: FormGroup;
  isLoading: boolean = false;
  isSubmitting = false;
  individualRemarks:FormGroup

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private fb: FormBuilder,
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
    this.remarksForm = new FormGroup({
      remarks: new FormControl('', Validators.required),
      
    })
    // this.individualRemarks=this.fb.group({

    // })
  }

  statuses = [
    { value: "ACCEPTED", name: 'Accept declaration' },
    { value: "REJECTED", name: 'Reject declaration' },
    { value: "REVERTED", name: 'Revert declaration' }
  ];

  openVerticallyCentered(content: TemplateRef<any>, notification: any) {
    this.modalService.open(content, { centered: true, });
    this.selectedNotification = notification;
    // console.log(this.selectedNotification)
    this.assignmentId = notification.assignmentId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const notificationDateArray = notification.date;
    const notificationDate = new Date(notificationDateArray[0], notificationDateArray[1] - 1, notificationDateArray[2]);
    this.date = notificationDate
    if (notificationDate < today) {
      this.showLateDeclarationUI = true;
      this.declarationForm = this.fb.group({
        file: ['', Validators.required],
        identityNo: ['',],
        description: ['',],
        reasons: ['', Validators.required]
      })
    } else {
      this.showLateDeclarationUI = false;
      this.declarationForm = this.fb.group({
        identityNo: ['', Validators.required],
        file: ['',],
        description: ['',],
        reasons: ['',]
      })
    }
    this.preselectNoButton();
  }

  checkAction(notification) {
    switch (notification.action) {
      case 'CoIGReview':
        this.openCoIGReviewModal(this.colreview, notification);
        break;
      case 'CoIGDeclare':
        this.openVerticallyCentered(this.content, notification);
        break;
      case 'CoIISupReview':
        this.openCoIISupReview(this.CoIISupReview, notification);
        break;
      // add more cases for other actions
      default:
        console.log('Unknown action');
    }
  }

  openCoIGReviewModal(colreview: TemplateRef<any>, notification: any) {
    this.selectedNotification = notification;
    this.modalService.open(colreview, { centered: true, });
  }

  openCoIISupReview(CoIISupReview: TemplateRef<any>, notification: any) {
    this.selectedNotification = notification;
    this.modalService.open(CoIISupReview, { centered: true, });
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
        file: ['', Validators.required],
        identityNo: ['', Validators.required],
        description: ['', Validators.required],
        reasons: ['', Validators.required]
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
        // console.log(this.notifications)
      },
      error: (error) => {
        console.error("There was an error!", error);
      },
    })
  }

  submitDeclarations(): void {
    this.isLoading = true;
    this.isSubmitting = true;
    // console.log("clicked button")
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
      console.log(declaration)
      formData.append('declaration', JSON.stringify(declaration));
      formData.append('file', this.declarationForm.get('file').value);
      this.httpService.postData(`${ApiEndPoints.DECLARATION_POST}`, formData,).subscribe({
        next: (response) => {
          this.modalService.dismissAll();
          this.openSuccessModal(this.nocontent)
          this.getNotifications();
        },
        complete: () => {
          this.isLoading = false;
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error("There was an error!", error);
          this.isSubmitting = false;
          if (error.status === 413) {
            this.snackBar.open(error.error.title, 'Close', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }
          if (error.status === 400) {
            this.snackBar.open(error.error.description, 'Close', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }
        },
      })
    }

    // console.log(this.declarationForm)  

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

  submitRemarks(): void {
    this.isLoading = true;
    const remarksData = {
      declarationId: this.selectedNotification.declarationId,
      status: "REVIEWED",
      remarks: this.remarksForm.get('remarks').value
    };
    this.httpService.postData(ApiEndPoints.REMARKS_POST, remarksData).subscribe({
      next: (response) => {
        this.modalService.dismissAll();
        this.openSuccessModal(this.nocontent)
        this.getNotifications();
      },
      complete: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error("There was an error!", error);
        this.isLoading = false;
      },
    });
  }
  cancelRemarks(): void {
    this.remarksForm.reset();
  }
}
