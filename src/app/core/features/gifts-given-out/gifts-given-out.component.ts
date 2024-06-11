import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';



import { HttpService } from 'app/core/services/http.service';
import { DatePipe } from '@angular/common';
import { OfficerType } from 'app/core/common/officerEnums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  pageOfItems: Array<any>; // Current page of items
 pageSize = 10; // Items per page
  currentPage = 1; // Current page index


  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private datePipe: DatePipe,
    private modalService: NgbModal, private fb: FormBuilder) {

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

  @ViewChild('content') content: TemplateRef<any>;

  ngOnInit(): void {
    this.getOccassions();
    this.giftsGivenOutHistory();
    console.log(this.officerTypeNames)
  }

  getOccassions(): void {
    this.httpService.get(ApiEndPoints.GIFTS_GIVEN_OUT).subscribe({
      next: (response) => {
        // console.log("Response", response)
        if (response.code === 200 && response.status === 'OK') {
          this.occasions = response.data
        }
        // console.log("Occassion",this.occasions)
      },
      error: (error) => {
        console.error("There was an error!", error);
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

  giftsGivenOutHistory(): void {
    this.httpService.get(ApiEndPoints.GIFTS_GIVEN_OUT_GET).subscribe({
      next: (res) => {

        this.history = res.data.content
       this.title = this.history.map(item => item.title);
        this.summary = this.history.map(item => item.summary);
      },
      error: (error) => {

      },
    });
  }


}
