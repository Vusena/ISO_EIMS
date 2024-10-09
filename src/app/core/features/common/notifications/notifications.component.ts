import { CommonModule } from '@angular/common';
import { Component, signal, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
import { HttpService } from 'app/core/services/http.service';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    NgbPopoverModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',

})

export class NotificationsComponent {

  @ViewChild('nocontent') nocontent: TemplateRef<any>;
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('colreview') colreview: TemplateRef<any>;
  @ViewChild('CoIISupReview') CoIISupReview: TemplateRef<any>;
  @ViewChild('CoIIDeclarantReview') CoIIDeclarantReview: TemplateRef<any>;
  @ViewChild('CoIIHoDReview') CoIIHoDReview: TemplateRef<any>

  readonly panelOpenState = signal(false);

  notifications: any[] = []
  selectedNotification: any;
  showLateDeclarationUI: boolean;
  declarationForm: FormGroup;
  conflictOfInterest: any;
  conflictOfInterestControl = new FormControl(null);
  assignmentId: number;
  date: any;
  remarksForm: FormGroup;
  individualForm: FormGroup;
  isLoading: boolean = false;
  isSubmitting = false;
  individualRemarks: FormGroup
  reasonCheck: boolean;
  fileToDownload: any;
  fileName: any;
  alertMessage: "string";
  errorMessage: "string";

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
      reasons: ['',],
      agree: ['']
    })
    this.remarksForm = new FormGroup({
      remarks: new FormControl('', Validators.required),

    })
    this.individualForm = this.fb.group({
      individualRemarks: ['', Validators.required],
      status: ['', Validators.required],

    })
  }

  actions: any = [
    { value: "ACCEPTED", name: 'Accept declaration' },
    { value: "REJECTED", name: 'Reject declaration' },
    { value: "REVERTED", name: 'Revert declaration' },
    { value: "ESCALATED_HOD", name: 'Escalate Declaration to HOD' }
  ];

  declarantActions: any = [
    { value: "COMPLETED", name: 'Complete declaration' },
    { value: "DISPUTED", name: 'Dispute remarks' },
  ];

  hodActions: any = [
    { value: "ACCEPTED", name: 'Complete declaration' },
    { value: "ESCALATED_HOD_ISO", name: 'Escalated to HOD ISO' },
  ];

  getNotifications(): void {
    this.httpService.get(ApiEndPoints.GET_NOTIFICATIONS).subscribe({
      next: (response) => {
        this.notifications = response.data
        console.log(this.notifications)
      },
      error: (error) => {
        console.error("There was an error!", error);
      },
    })
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
      case 'CoIIDeclarantReview':
        this.openCoIIDeclarantReview(this.CoIIDeclarantReview, notification);
        break;
       case 'CoIIHoDReview':
        this.openCoIIHoDReview(this.CoIIHoDReview, notification);
        break;
      // add more cases for other actions
      default:
        console.log('Unknown action');
    }
  }

  openCoIISupReview(CoIISupReview: TemplateRef<any>, notification: any) {
    this.selectedNotification = notification;
    console.log(this.selectedNotification, "openCoIISupReview() has been called")
    this.modalService.open(CoIISupReview, { centered: true, });
  }

  openVerticallyCentered(content: TemplateRef<any>, notification: any) {
    this.modalService.open(content, { centered: true, });
    this.selectedNotification = notification;
    console.log(this.selectedNotification)
    this.assignmentId = notification.assignment.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const notificationDateArray = notification.assignment.date;
    const notificationDate = new Date(notificationDateArray[0], notificationDateArray[1] - 1, notificationDateArray[2]);
    this.date = notificationDate
    if (notificationDate < today) {
      this.showLateDeclarationUI = true;
      this.declarationForm = this.fb.group({
        file: ['', Validators.required],
        identityNo: ['', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(8) // 
        ]],
        description: ['',],
        reasons: ['', Validators.required],
        agree: ['', Validators.requiredTrue]
      })
    } else {
      this.showLateDeclarationUI = false;
      this.declarationForm = this.fb.group({
        identityNo: ['', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(8) // 
        ]],
        file: ['',],
        description: ['',],
        reasons: ['',],
        agree: ['', Validators.requiredTrue]
      })
    }
    this.preselectNoButton();
  }

  openCoIGReviewModal(colreview: TemplateRef<any>, notification: any) {
    this.selectedNotification = notification;
    console.log(this.selectedNotification)
    this.modalService.open(colreview, { centered: true, });
    const checkTimee = notification.declaration.reasons.trim() !== '';
    this.reasonCheck = checkTimee;
    this.fileToDownload = "http://10.153.3.22" + notification.declaration.filePath;
    this.fileName = notification.declaration.fileName;
  }

  openCoIIDeclarantReview(CoIIDeclarantReview: TemplateRef<any>, notification: any) {
    this.selectedNotification = notification;
    console.log(this.selectedNotification);
    this.modalService.open(CoIIDeclarantReview, { centered: true, });
  }

  openCoIIHoDReview(CoIIHoDReview: TemplateRef<any>, notification: any) {
    this.selectedNotification = notification;
    console.log(this.selectedNotification);
    this.modalService.open(CoIIHoDReview, { centered: true, });
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
      identityNo: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(8)
      ]],
      description: ['', Validators.required],
      reasons: ['',],
      agree: ['', Validators.requiredTrue]
    })
    // console.log(this.date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (this.date < today) {
      this.showLateDeclarationUI = true;
      this.declarationForm = this.fb.group({
        file: ['', Validators.required],
        identityNo: ['', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(8)
        ]],
        description: ['', Validators.required],
        reasons: ['', Validators.required],
        agree: ['', Validators.requiredTrue]
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
      declarationId: this.selectedNotification.declaration.id,
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
  // Submit Declarations
  submitIndividualRemarks() {
    this.isLoading = true;
    console.log(this.selectedNotification.action)
    const declarationId = this.selectedNotification.declarationId;
    const individualRemarksData = {
      declarationId: declarationId,
      status: this.individualForm.get('status').value,
      remarks: this.individualForm.get('individualRemarks').value
    };
    this.httpService.postData(ApiEndPoints.INDIVIDUAL_SUPERVISOR_REVEIW_POST, individualRemarksData).subscribe({
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
        this.errorMessage = error.error.description
      },
    });
  }

  submitDeclarantRemarks() {
    console.log(this.selectedNotification.action)
    this.isLoading = true;
    const declarationId = this.selectedNotification.declarationId;
    const individualRemarksData = {
      declarationId: declarationId,
      status: this.individualForm.get('status').value,
      remarks: this.individualForm.get('individualRemarks').value
    };
    this.httpService.postData(ApiEndPoints.INDIVIDUAL_DECLARANT_ACTION_POST, individualRemarksData).subscribe({
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
        this.errorMessage = error.error.description
      },
    });
  }
}

