import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';

import { HttpService } from 'app/core/services/http.service';
import { DatePipe } from '@angular/common';
import { OfficerType } from 'app/core/common/officerEnums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

interface Occasion {
  id: number;
  name: string;
  active: boolean;
}

@Component({
  selector: 'app-gifts-given-out',
  templateUrl: './gifts-given-out.component.html',
  styleUrls: ['./gifts-given-out.component.scss'],
  encapsulation: ViewEncapsulation.None // Apply styles globally
})

export class GiftsGivenOutComponent implements OnInit {

  today = new Date();
  occasions: Occasion[] = [];

  // Display names for the UI
  officerTypeNames = {
    [OfficerType.PublicOfficer]: 'Public',
    [OfficerType.StateOfficer]: 'State'
  };

  officerEnumValues = Object.values(OfficerType);
  actor:string;
  historyProgress:any;
  historyDeclaration:any;
  recipient: string;
  officer = OfficerType;     //sends data to the backend
  officerType: OfficerType; //declaring a property for internal use
  dateIssued: Date;
  occasionId: number;
  specified: any;
  description: string;
  value: number;
  alertMessage: string;
  legalReqAgreed: boolean = false;
  giftForm: FormGroup;

  title: string;
  summary: string;
  history: any;
  length:number; //total number of items or records
  pageSize:number =5; // specifies the number of items or records to be displayed on a single page.
  pageSizeOptions: number[] = [5, 10, 15, 20]; //This is an array that defines the set of options available for the user to select
  currentPage:number=0; //holds the current page number that the user is viewing
  historyId:number;

  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private httpService: HttpService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.giftForm = this.fb.group({
      // declarationDate: [{value: '', disabled: true}, Validators.required],
      dateIssued: ['', Validators.required],
      occasionId: ['', Validators.required],
      officerType: ['', Validators.required],
      specified: ['',],
      value: ['', Validators.required],
      recipient: ['', Validators.required],
      description: ['', Validators.required],
      legalReqAgreed: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.getOccasions();
    this.giftsGivenOutHistory();
    // this.giftsGivenOutProgress();
    this.historyProgress = [
      // Add default objects representing the initial state of each step
      { actor: 'Once you declare', action: 'This will be your progress bar to track which stage the declaration is at.' },
      { actor: '', action: '' },
    ];
  }

  getOccasions(): void {
    this.httpService.get(ApiEndPoints.GIFTS_GIVEN_OUT).subscribe({
      next: (response) => {
        // console.log("Response", response)
        if (response.code === 200 && response.status === 'OK') {
          this.occasions = response.data
        }
        //console.log("Occasion",this.occasions)
      },
      error: () => {
        //console.error("There was an error!", error);
      },
    })
  }

  submitGiftGivenDetails(): void {
    const formattedDate = this.datePipe.transform(this.giftForm.get('dateIssued').value, 'yyyy-MM-dd');
    const giftData = {
      recipient: this.giftForm.get('recipient').value,
      officer: this.giftForm.get('officerType').value,
      dateIssued: formattedDate,
      occasionId: this.giftForm.get('occasionId').value,
      specified: this.giftForm.get('specified').value,
      description: this.giftForm.get('description').value,
      value: this.giftForm.get('value').value,
    };
    console.log("Gift data", giftData)
    this.httpService.postData(ApiEndPoints.GIFTS_GIVEN_OUT_STORE, giftData).subscribe({
      next: (response) => {
        // console.log(response)
        this.alertMessage = response.body.description
        this.openVerticallyCentered(this.content);
        this.clearField()
      },
      error: (error) => {
        console.error("There was an error!", error);
      },
    });
  }
  // Reset all properties to their default values
  clearField(): void {
    this.giftForm.reset();
  }
  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }
  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }

  giftsGivenOutHistory() {
    this.httpService.getAllnominees(ApiEndPoints.GIFTS_GIVEN_OUT_GET,null,this.currentPage,this.pageSize).subscribe({
      next: (res) => {
        this.history = res.data.content;
        this.length = res.data.totalElements;
      },
      error: () => {
        // ... error handling
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.giftsGivenOutHistory();
  }
  onHistoryItemClick(itemId: number): void {
    console.log(itemId)
    this.giftsGivenOutProgress(itemId);
  }

  giftsGivenOutProgress(id: number) {
    const urlWithId = `${ApiEndPoints.GIFT_GIVEN_OUT_GET_PROGRESS}/${id}`;
    this.httpService.getById(urlWithId).subscribe({
      next: (res) => {
        this.historyProgress = res.data.progress;
        this.historyDeclaration = res.data.declaration;

        //console.log(this.historyDeclaration)
        const date=new Date(res.data.declaration.date_issued)

        this.giftForm.patchValue({
          dateIssued: date,
          occasionId: this.historyDeclaration.occasion.id,
          officerType: this.historyDeclaration.officer,
          specified: this.historyDeclaration.specified,
          value:this.historyDeclaration.value,
          recipient: this.historyDeclaration.recipient,
          description: this.historyDeclaration.description,
        });
        //console.log(this.giftForm)
      },
      error: () => {
        // ... error handling
      },
    });
  }
}
