import {Component, inject, OnInit, signal, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe, DecimalPipe} from "@angular/common";
import {PreviewComponent} from "../common/preview/preview.component";
import {AuthService} from 'app/core/services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpParams} from "@angular/common/http";
import {HttpsService} from "../../services/https.service";
import {Constants} from "../../utils/constants";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-gifts-received',
  templateUrl: './gifts-received.component.html',
  styleUrls: ['./gifts-received.component.scss'],
  providers: [DecimalPipe],
})
export class GiftsReceivedComponent implements OnInit {
  history: any;
  page = 0;
  size = 4;
  length = 0;
  progress: any;
  declaration: any;

  today = new Date();
  occasions: any;
  user: any;

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
    private fb: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe
  ) {

    this.formGroup = this.fb.group({
      dateReceived: ['', Validators.required],
      dateSurrendered: ['', Validators.required],
      conferrer: ['', Validators.required],
      identityNo: ['', [
        Validators.required,
        Validators.pattern('^[A-Z0-9]*$'),
        Validators.minLength(6),
        Validators.maxLength(8)
      ]],
      value: ['', [Validators.required, Validators.min(1)]],
      occasionId: ['', Validators.required],
      specified: ['',],
      description: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    });

    this.formGroup.get('occasionId').valueChanges.subscribe(value => {
      this.updateSpecifiedValidation(value);
    });
  }

  updateSpecifiedValidation(occasionId: number) {
    const specifiedControl = this.formGroup.get('specified');
    if (occasionId === 5) {
      specifiedControl.setValidators([Validators.required]);
    } else {
      specifiedControl.clearValidators();
    }
    specifiedControl.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.progress = [
      {
        title: 'Once you declare',
        description: 'This will be your progress bar to track which stage the declaration is at.'
      },
      { title: "", description: "" },
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
    this.service.get(`${Constants.BASE_URL}/gifts-received/history`, params).subscribe({
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
    if (this.user.data.supervisor != null) {
      supName = this.user.data.supervisor.name;
      supStaffNo = this.user.data.supervisor.staffNo;
    }
    else if(this.user.data.department!=null) {
      department=this.user.data.department;
    }
    const formValues = this.formGroup.getRawValue();
    const occasionValue = formValues.occasionId === 5 ? formValues.specified :
      this.occasions.find((o: { id: number; }) => o.id === formValues.occasionId)?.name || '';

    const data: any[] = [
      {
        label: "PERSONAL DETAILS",
        class: "col-12 text-center mt-3 h5"
      },
      {
        label: "Name",
        value: this.user.data.name,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Personal No.",
        value: this.user.data.staffNo,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Department",
        value: this.user.data.department,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Designation",
        value: this.user.data.grade.description,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Supervisor Name",
        value: this.user.data.supervisor.name,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Supervisor Personal No.",
        value: this.user.data.supervisor.staffNo,
        class: "col-sm-6 pb-1"
      },
      {
        label: "DECLARATION DETAILS",
        class: "col-12 text-center mt-3 h5"
      },
      {
        label: "ID/Passport Number",
        value: formValues.identityNo,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Declaration Date",
        value: this.datePipe.transform(this.today, 'dd-MM-yyyy'),
        class: "col-sm-6 pb-1"
      },
      {
        label: "Assignment Date",
        value: this.datePipe.transform(formValues.dateReceived, 'dd-MM-yyyy'),
        class: "col-sm-6 pb-1"
      },
      {
        label: "Date Surrendered",
        value: this.datePipe.transform(formValues.dateSurrendered, 'dd-MM-yyyy'),
        class: "col-sm-6 pb-1"
      },
      {
        label: "Name of Giver",
        value: formValues.conferrer,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Value of Gift",
        value: this.decimalPipe.transform(formValues.value,  '1.2-2'),
        class: "col-sm-6 pb-1"
      },
      {
        label: formValues.specified ? "Specified Occasion" : "Occasion",
        value: occasionValue,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Description",
        value: formValues.description,
        class: "col-sm-12"
      }
    ];

    const modalRef = this.modalService.open(PreviewComponent, { centered: true });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
        this.previewed = result;
    });
  }

  post() {
    this.isLoading = true;

    const formValues = this.formGroup.getRawValue();

    const data = {
      identityNo: formValues.identityNo,
      conferrer: formValues.conferrer,
      dateReceived: this.datePipe.transform(formValues.dateReceived, 'yyyy-MM-dd'),
      dateSurrendered: this.datePipe.transform(formValues.dateSurrendered, 'yyyy-MM-dd'),
      occasionId: formValues.occasionId,
      specified: formValues.specified,
      description: formValues.description,
      value: formValues.value,
    };
   

    this.service.post(`${Constants.BASE_URL}/gifts-received`, data).subscribe({
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
      }
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

        const dateReceived = new Date(this.declaration.dateReceived)
        const dateSurrendered = new Date(this.declaration.dateSurrendered)

        this.formGroup.patchValue({
          dateReceived: dateReceived,
          dateSurrendered:dateSurrendered,
          conferrer: this.declaration.conferrer,
          identityNo:this.declaration.identityNo,
          value: this.declaration.value,
          occasionId:this.declaration.occasionId,
          specified: this.declaration.specified,
          description:this.declaration.description
        });

        this.formGroup.disable()
      },
      error: () => {},
    });
  }

  clear() {
    this.formGroup.reset();
    this.progress = [
      {
        title: 'Once you declare',
        description: 'This will be your progress bar to track which stage the declaration is at.'
      },
      { title: "", description: "" },
    ];
  }

  backButton() {
    this.formGroup.reset();
    this.hideButtons = true;
    this.backButtonControl = false;
    this.formGroup.enable()
  }
}
