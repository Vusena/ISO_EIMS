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
    private route: ActivatedRoute
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
      nature: ['', Validators.required],
      nocId: ['', Validators.required],
      description: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.getHistory();
    this.progress = [
      {
        title: 'Once you declare',
        description: 'This will be your progress bar to track which stage the declaration is at.'
      },
      { title: "", description: "" },
    ];

    this.route.queryParams.subscribe(params => {
      const declarationId = params['declarationId'];
      console.log('declarationId', declarationId)
      if (declarationId) {
        this.checkHistoryHighlight(declarationId);
        this.getItem2(`coi-individual/${declarationId}`)
        
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
    else if (this.user.data.department != null) {
      department = this.user.data.department;
    }
    const formValues = this.formGroup.getRawValue();
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
        value: this.user.data.department,
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
        label: "Nature of Conflict",
        value: this.natures.find((o: { id: number; }) => o.id === formValues.nocId)['name'],
        class: "col-sm-6"
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
      description: formValues.description
    };

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
    this.formGroup.enable()
  }
}
