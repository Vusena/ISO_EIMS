import { Component, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from "@angular/common";
import { PreviewComponent } from "../common/preview/preview.component";
import { AuthService } from "../../services/auth.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpsService } from "../../services/https.service";
import { Constants } from "../../utils/constants";
import { HttpParams } from "@angular/common/http";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'app/core/services/notification.service';

@Component({
  selector: 'app-individual-conflict',
  templateUrl: './individual-conflict.component.html',
  styleUrls: ['./individual-conflict.component.scss']
})
export class IndividualConflictComponent implements OnInit {
  history: any[] = [];
  page = 0;
  size = 5;
  length: any;
  progress: any;
  declaration: any;
  highlightedItemId: number;
  today = new Date();
  natures: any;
  user: any;
  declarationId = 0;

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
  @ViewChild(PreviewComponent) previewModal: PreviewComponent;
  private modalService = inject(NgbModal);
  @ViewChild('content') content: TemplateRef<any>;

  constructor(
    private service: HttpsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.formGroup = this.formBuilder.group({
      date: ['', Validators.required],
      identityNo: ['', [
        Validators.required,
        Validators.pattern('^[A-Z0-9]*$'),
        Validators.minLength(6),
        Validators.maxLength(8),
      ]],
      venue: ['', Validators.required],
      specifiednature:[''],
      nature: ['', Validators.required],
      nocId: ['', Validators.required],
      description: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    });
    this.formGroup.get('nocId').valueChanges.subscribe(value => {
      this.updateSpecifiedValidation(value);
    });
  }

  updateSpecifiedValidation(nocId: number) {
    const specifiedControl = this.formGroup.get('specifiednature');
    if (nocId === 5) { // Assuming 5 is the ID for "Other"
      specifiedControl.setValidators([Validators.required]);
    } else {
      specifiedControl.clearValidators();
    }
    specifiedControl.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.notificationService.getNotifications();  
    this.getHistory();
    this.progress = [
      {
        title: 'Once you declare',
        description: 'This will be your progress bar to track which stage the declaration is at.'
      },
      { title: "", description: "" },
    ];

    this.route.queryParams.subscribe(params => {
      this.declarationId = params['declarationId'];
      
      if (this.declarationId > 0) {
        this.checkHistoryHighlight(this.declarationId);
        this.getItem2(`coi-individual/${this.declarationId}`)
        
      }
    });
    this.getUser();
    this.getNatures();
  }

  getUser(): void {
    this.user = this.authService.getLoggedInUser();
  }

  getNatures(): void {
    this.service.get(`${Constants.BASE_URL}/nature-of-conflicts`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.natures = response.data
        console.log(this.natures)
      },
      error: () => { },
    })
  }

  getHistory() {
    const params = new HttpParams({
      fromObject: { page: this.page, size: this.size }
    });

    this.service.get(`${Constants.BASE_URL}/coi-individual/history`, params).subscribe({
      next: (response: any) => {
        this.history = response.data.content;
        console.log('HISTORY', this.history)
        this.length = response.data.totalElements;
      },
      error: () => { },
    });
  }

  checkHistoryHighlight(declarationId: number) {

    console.log(this.history, 'HISTORY')
    const foundItem = this.history.find(item => item.id === declarationId);
    console.log('foundItem', foundItem)
    if (foundItem) {
      console.log('foundItem', foundItem)
      this.highlightedItemId = foundItem.id; // Set the highlighted ID
    }
    else {
      console.log('Not found')
    }
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
    let department = "";
    if (this.user.data.supervisor != null) {
      supName = this.user.data.supervisor.name;
      supStaffNo = this.user.data.supervisor.staffNo;
    }    
    if (this.user.data.department != null) {
      department = this.user.data.department;
    }
    const formValues = this.formGroup.getRawValue();
    const natureValue = formValues.nocId === 5 ? formValues.specifiednature :
      this.natures.find((o: { id: number; }) => o.id === formValues.nocId)?.name || '';

    const data: any = [
      {
        label: "PERSONAL DETAILS",
        class: "col-sm-12 text-center mt-2 text-decoration-underline"
      },
      {
        label: "Name",
        value: this.user.data.name,
        class: "col-sm-6"
      },
      {
        label: "Personal No.",
        value: this.user.data.staffNo,
        class: "col-sm-6"
      },
      {
        label: "Department",
        value: department,
        class: "col-sm-6"
      },
      {
        label: "Designation",
        value: this.user.data.grade.description,
        class: "col-sm-6"
      },
      {
        label: "Supervisor Name",
        value: supName,
        class: "col-sm-6"
      },
      {
        label: "Supervisor Personal No.",
        value: supStaffNo,
        class: "col-sm-6"
      },

      {
        label: "DECLARATION DETAILS",
        class: "col-12 text-center mt-2 text-decoration-underline"
      },
      {
        label: "ID/Passport Number",
        value: formValues.identityNo,
        class: "col-sm-6"
      },
      {
        label: "Declaration Date",
        value: this.datePipe.transform(this.today, 'dd-MM-yyyy'),
        class: "col-sm-6"
      },
      {
        label: "Assignment Date",
        value: this.datePipe.transform(formValues.date, 'dd-MM-yyyy'),
        class: "col-sm-6"
      },
      {
        label: "Venue of Assignment",
        value: formValues.venue,
        class: "col-sm-6"
      },
      {
        label: "Nature of Assignment",
        value: formValues.nature,
        class: "col-sm-6"
      },
      {
        label: formValues.specifiednature ? "Nature of Conflict (Specified):" : "Nature of Conflict:",
        value: natureValue,
        class: "col-sm-6 pb-1"
      },
      {
        label: "Description of Conflict",
        value: formValues.description,
        class: "col-sm-12"
      }
    ]
    const modalRef = this.modalService.open(PreviewComponent, { centered: true });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      this.previewed = result
    });
  }

  post() {
    this.isLoading = true;
    const formValues = this.formGroup.getRawValue();
    const data = {
      identityNo: formValues.identityNo,
      date: this.datePipe.transform(formValues.date, 'yyyy-MM-dd'),
      venue: formValues.venue,
      nature: formValues.nature,
      nocId: formValues.nocId,
      specified:formValues.specifiednature,
      description: formValues.description
    };   

    if (this.declarationId > 0) {
      this.service.put(`${Constants.BASE_URL}/coi-individual/${this.declarationId}`, data).subscribe({
        next: (response) => {
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
    } else {
      this.service.post(`${Constants.BASE_URL}/coi-individual`, data).subscribe({
        next: (response) => {
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
        const date = new Date(this.declaration.assignment_date)
        this.formGroup.patchValue({
          date: date,
          identityNo: this.declaration.declarant_id_no,
          specifiednature:this.declaration.specified,
          venue: this.declaration.venue,
          nature: this.declaration.assignment_title,
          nocId: this.declaration.noc_id,
          description: this.declaration.description
        });
        this.formGroup.disable()
      },
      error: () => { },
    });
  }

  getItem2(url: string) {
    this.service.get(`${Constants.BASE_URL}/${url}`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.progress = response.data.progress;
        this.declaration = response.data.declaration;
        const date = new Date(this.declaration.assignment_date)
        this.formGroup.patchValue({
          date: date,
          identityNo: this.declaration.declarant_id_no,          
          venue: this.declaration.venue,
          nature: this.declaration.assignment_title,
          nocId: this.declaration.noc_id,
          specifiednature:this.declaration.specified,
          description: this.declaration.description
        }); 
      },
      error: () => { },
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
