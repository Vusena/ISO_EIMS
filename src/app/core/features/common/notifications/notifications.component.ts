import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
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
import { HttpsService } from 'app/core/services/https.service';
import { Constants } from 'app/core/utils/constants';


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
  @ViewChild('CoIIHoDReview') CoIIHoDReview: TemplateRef<any>;
  @ViewChild('CoIIHoDISOReview') CoIIHoDISOReview: TemplateRef<any>;
  @ViewChild('GRSupReview') GRSupReview: TemplateRef<any>;
  @ViewChild('GRHoDReview') GRHoDReview: TemplateRef<any>;
  

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
  individualRemarks: FormGroup;
  giftsReceivedForm: FormGroup;
  reasonCheck: boolean;
  fileToDownload: any;
  fileName: any;
  alertMessage: "string";
  errorMessage: "string";
  declarationCheck: boolean;
  receivedGiftsResponces: any;

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService,
    private fb: FormBuilder,
    private service: HttpsService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getNotifications();
    this.preselectNoButton();
    this.getGiftsReceivedResponses();
    this.declarationForm = this.fb.group({
      file: ['', Validators.required],
      identityNo: ['', [
        Validators.required,
        Validators.pattern('^[A-Z0-9]*$'),
        Validators.minLength(6),
        Validators.maxLength(8)
      ]],
      description: ['', Validators.required],
      reasons: ['', Validators.required],
      agree: ['', Validators.required]
    })
    this.remarksForm = new FormGroup({
      remarks: new FormControl('', Validators.required),
    })

    this.individualForm = this.fb.group({
      individualRemarks: ['', Validators.required],
      status: ['', Validators.required],
    })
    this.giftsReceivedForm = this.fb.group({
      action: ['',],
      status: ['', Validators.required],
      remarks: ['',]
    })
  }

  actions: any = [
    { value: "PROCESSED", name: 'Accept declaration' },
    { value: "REJECTED", name: 'Reject declaration' },
    { value: "REVERTED", name: 'Revert declaration' },
    { value: "ESCALATED_HOD", name: 'Escalate Declaration to HOD' }
  ];

  declarantActions: any = [
    { value: "ACKNOWLEDGED", name: 'Acknowledge Remarks' },
    { value: "DISPUTED", name: 'Dispute Remarks' },
  ];

  hodActions: any = [
    { value: "PROCESSED", name: 'Complete declaration' },
    { value: "ESCALATED_HOD_ISO", name: 'Escalated to HOD ISO' },
  ];

  giftsReceivedSupActions: any = [
    { value: "PROCESSED", name: 'Process declaration' },
    { value: "REJECTED", name: 'Reject declaration' },
    { value: "ESCALATED_HOD", name: 'Escalate Declaration' },
  ]
  giftsReceivedHodActions: any = [
    { value: "PROCESSED", name: 'Process declaration' },
    { value: "ESCALATED_HOD_ISO", name: 'Escalate Declaration' },
  ]

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

  getGiftsReceivedResponses(): void {
    this.service.get(`${Constants.BASE_URL}/gift-responses`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.receivedGiftsResponces = response.data
        console.log(this.receivedGiftsResponces)
      },
      error: () => { },
    })
  }

  checkAction(notification) {
    console.log(notification.action)
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
      case 'CoIIHoDISOReview':
        this.openCoIIHoDISOReview(this.CoIIHoDISOReview, notification);
        break;
      case 'GRSupReview':
        this.openGRSupReview(this.GRSupReview, notification);
        break;
      case 'GRHoDReview':
        this.openGRHoDReview(this.GRHoDReview, notification);
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
          Validators.pattern('^[A-Z0-9]*$'),
          Validators.minLength(6),
          Validators.maxLength(8)
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
          Validators.pattern('^[A-Z0-9]*$'),
          Validators.minLength(6),
          Validators.maxLength(8)
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
  openCoIIHoDISOReview(CoIIHoDISOReview: TemplateRef<any>, notification: any) {
    this.selectedNotification = notification;
    console.log(this.selectedNotification);
    this.modalService.open(CoIIHoDISOReview, { centered: true, });
  }
  openGRSupReview(GRSupReview: TemplateRef<any>, notification: any) {
    this.selectedNotification = notification;
    this.modalService.open(GRSupReview, { centered: true, });
  }
  openGRHoDReview(GRHoDReview : TemplateRef<any>, notification: any){
    this.selectedNotification = notification;
    this.modalService.open(GRHoDReview, { centered: true, });
  }

  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }

  onNoConflictClick(): void {
    // this.modalService.dismissAll();
    // this.modalService.open(nocontent, { centered: true, }) 
    this.declarationCheck = false;
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    if (noButton && yesButton) {
      noButton.classList.add('selected');
      yesButton.classList.remove('selected');
    }
    this.conflictOfInterestControl.setValue(0);
    console.log(this.declarationForm.get('identityNo').errors);
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

  onConflictClick(): void {
    this.declarationCheck = true;
    this.conflictOfInterest = 1;
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    if (noButton && yesButton) {
      yesButton.classList.add('selected');
      noButton.classList.remove('selected');
    }
    this.conflictOfInterestControl.setValue(1);
    console.log("Yes button has been clicked")
    console.log(this.date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.declarationForm.get('description')?.setValidators([Validators.required]);
    this.declarationForm.get('description')?.updateValueAndValidity();
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
      status: "PROCESSED",
      remarks: this.remarksForm.get('remarks').value
    };
    console.log(remarksData)
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
    this.httpService.postData(ApiEndPoints.INDIVIDUAL_HOD_REVEIW_POST, individualRemarksData).subscribe({
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

  submitHODISORemarks() {
    console.log(this.selectedNotification.action)
    this.isLoading = true;
    const declarationId = this.selectedNotification.declarationId;
    const individualRemarksData = {
      declarationId: declarationId,
      status: 'PROCESSED',
      remarks: this.remarksForm.get('remarks').value
    };
    this.httpService.postData(ApiEndPoints.INDIVIDUAL_HOD_ISO_REVIEW, individualRemarksData).subscribe({
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
  submitGiftsReceviedRemarks(): void {
    const declarationId = this.selectedNotification.declarationId;
    console.log(this.selectedNotification)
    const data = {
      // declarationId: declarationId,      
      responseId: this.giftsReceivedForm.get('action').value,
      remarks: this.giftsReceivedForm.get('remarks').value,
      status: this.giftsReceivedForm.get('status').value,
    }
    console.log(data)
    this.service.post(`${Constants.BASE_URL}/gifts-received-review/supervisor`, data).subscribe({
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
        this.errorMessage = error.message
      },
    });
  }
}

