import {Component, inject, OnInit, signal, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe, DecimalPipe} from '@angular/common';
import {OfficerType} from 'app/core/common/officerEnums';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PageEvent} from '@angular/material/paginator';
import {AuthService} from 'app/core/services/auth.service';
import {PreviewComponent } from '../common/preview/preview.component';
import {Constants} from "../../utils/constants";
import {HttpParams} from "@angular/common/http";
import {HttpsService} from "../../services/https.service";
import { NotificationService } from 'app/core/services/notification.service';

@Component({
  selector: 'app-gifts-given-out',
  templateUrl: './gifts-given-out.component.html',
  styleUrls: ['./gifts-given-out.component.scss'],
  providers: [DecimalPipe],
  encapsulation: ViewEncapsulation.None // Apply styles globally
})

export class GiftsGivenOutComponent implements OnInit {
  history: any;
  page = 0;
  size = 4;
  length = 0;
  progress: any;
  declaration: any;

  today = new Date();
  occasions: any;
  user: any;

  officerTypeNames = {
    [OfficerType.PublicOfficer]: 'Public',
    [OfficerType.StateOfficer]: 'State'
  };
  officerEnumValues = Object.values(OfficerType);

  alert = {
    type: "success",
    isOpen: false,
    title: 'Hurray!',
    message: ""
  }

  formGroup: FormGroup;
  previewed = false;
  isLoading = false;

  backButtonControl = false;
  hideButtons = true;

  readonly panelOpenState = signal(false);
  private modalService = inject(NgbModal);
  @ViewChild('content') content: TemplateRef<any>;

  constructor(
    private service: HttpsService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  updateSpecifiedValidation(occasionId: number) {
    const specifiedControl = this.formGroup.get('specified');
    if (occasionId === 5) { // Assuming 5 is the ID for "Other"
      specifiedControl.setValidators([Validators.required]);
    } else {
      specifiedControl.clearValidators();
    }
    specifiedControl.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.notificationService.getNotifications();  
    this.formGroup = this.formBuilder.group({
      dateIssued: ['', Validators.required],
      occasionId: ['', Validators.required],
      officerType: ['', Validators.required],
      specified: ['',],
      value: ['', [Validators.required, Validators.min(1)]],
      recipient: ['', Validators.required],
      description: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    });

    this.formGroup.get('occasionId').valueChanges.subscribe(value => {
      this.updateSpecifiedValidation(value);
    });
    this.progress = [
      { title: 'Once you declare', description: 'This will be your progress bar to track which stage the declaration is at.' },
      { title: '', description: '' },
    ];
    this.getUser();
    this.getOccasions();
    this.getHistory();
  }

  getUser(): void {
    this.user = this.authService.getLoggedInUser();
 
  }

  getOccasions(): void {
    this.service.get(`${Constants.BASE_URL}/occasions`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.occasions = response.data
      },
      error: () => {},
    })
  }

  getHistory() {
    const params = new HttpParams({
      fromObject: { page: this.page, size: this.size }
    });

    this.service.get(`${Constants.BASE_URL}/gifts-given-out/history`, params).subscribe({
      next: (response: any) => {
        this.history = response.data.content;
        this.length = response.data.totalElements;
      },
      error: () => {},
    });
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.size = e.pageSize;
    this.page = e.pageIndex;
    this.getHistory();
  }

  submit(): void {
    this.previewed ? this.post() : this.preview();
  }

  preview() {
    let supName = "";
    let supStaffNo = "";
    let department="";
    let grade="";

    if (this.user.data.supervisor != null) {
      supName = this.user.data.supervisor.name;
      supStaffNo = this.user.data.supervisor.staffNo;
    }
    if (this.user.data.department != null) {
      department = this.user.data.department;
    }
    if (this.user.data.grade != null) {
      grade = this.user.data.grade.description;
    }   

    const formValues = this.formGroup.getRawValue();
    const occasionValue = formValues.occasionId === 5 ? formValues.specified :
      this.occasions.find((o: { id: number; }) => o.id === formValues.occasionId)?.name || '';

    const data = [
      {
        label: "PERSONAL DETAILS",
        class: "col-12 text-center mt-3 h5"
      },
      {
        label: "Name:",
        value: this.user.data.name,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Personal No.:",
        value: this.user.data.staffNo,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Department:",
        value: department,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Designation:",
        value: grade,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Supervisor Name:",
        value: supName,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Supervisor Personal No.:",
        value: supStaffNo,
        class: "col-sm-6 pb-1"
      },
      {
        label: "DECLARATION DETAILS",
        class: "col-12 text-center mt-3 h5"
      },
      {
        label: "Declaration Date:",
        value: this.datePipe.transform(this.today, 'dd-MM-yyyy'),
        class: "col-sm-6 pb-1"
      },
      {
        label: "Date of Gifting:",
        value: this.datePipe.transform(formValues.dateIssued, 'dd-MM-yyyy'),
        class: "col-sm-6 pb-1"
      },
      {
        label: formValues.specified ? "Specified Occasion:" : "Occasion:",
        value: occasionValue,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Name of Receiving Entity:",
        value: formValues.recipient,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Value of Gift:",
        value: this.decimalPipe.transform(formValues.value,  '1.2-2'),
        class: "col-sm-6 pb-1"
      },
      {
        label: "Officer Type:",
        value: formValues.officerType,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Gift Description:",
        value: formValues.description,
        class: "col-sm-12"
      }
    ];

    const modalRef = this.modalService.open(PreviewComponent, { centered: true });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      this.previewed = result
    });
  }

  post(): void {
    this.isLoading = true;
    const formValues = this.formGroup.getRawValue();
    const data = {
      recipient: formValues.recipient,
      officer: formValues.officerType,
      dateIssued: this.datePipe.transform(formValues.dateIssued, 'yyyy-MM-dd'),
      occasionId: formValues.occasionId,
      specified: formValues.specified,
      description: formValues.description,
      value: formValues.value,
    };

    this.service.post(`${Constants.BASE_URL}/gifts-given-out`, data).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.isLoading = false;
          this.openVerticallyCentered(this.content);
          //this.form.reset();
        }
      },
      complete() {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;

        this.alert.message = error.message;
        this.alert.title = "Oops!";
        this.alert.type = "danger";

        this.alert.isOpen = true;
      },
    });
  }

  onCloseAlert() {
    this.alert.isOpen = false;
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }

  onHistoryItemClick(url: string): void {
    this.getItem(url);
    this.hideButtons = false;
    this.backButtonControl = true;
  }

  getItem(url: string) {
    this.service.get(`${Constants.BASE_URL}/${url}`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.progress = response.data.progress;
        this.declaration = response.data.declaration;

        const date = new Date(this.declaration.date_issued)

        this.formGroup.patchValue({
          dateIssued: date,
          occasionId: this.declaration.occasion_id,
          officerType: this.declaration.officer,
          specified: this.declaration.occasion,
          value: this.declaration.value,
          recipient: this.declaration.recipient,
          description: this.declaration.description,
        });

        this.formGroup.disable()
      },
      error: () => {},
    });
  }

  clear(): void {
    this.formGroup.reset();
    this.progress = [
      { title: 'Once you declare', description: 'This will be your progress bar to track which stage the declaration is at.' },
      { title: '', description: '' }
    ];
  }

  backButton() {
    this.formGroup.reset();
    this.hideButtons = true;
    this.backButtonControl = false;
    this.formGroup.enable();
    this.progress = [
      {
        title: 'Once you declare',
        description: 'This will be your progress bar to track which stage the declaration is at.'
      },
      { title: "", description: "" },
    ];
  }
}
