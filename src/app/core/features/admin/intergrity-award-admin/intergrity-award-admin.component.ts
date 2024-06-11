import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
import { AuthService } from 'app/core/services/auth.service';
import { HttpService } from 'app/core/services/http.service';
import { SuccessComponent } from '../../common/success/success.component';

import { ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-intergrity-award-admin',
  templateUrl: './intergrity-award-admin.component.html',
  styleUrl: './intergrity-award-admin.component.scss'
})

export class IntergrityAwardAdminComponent implements OnInit {
  filteredkrastaff: any[] = [];
  searchText: string = '';
  specificName: string = '';
  errorMessage: string = '';
  krastafflist: any;
  status_code: any;
  staff_number: any;
  department: any;
  region: any;
  success: boolean = false;
  alertMessage: string;
  nomineeData: FormGroup;
  missingdetails: string;
  isConfirmed: boolean;
  nominee:any;
  nonominee:any;

  integrityAndProfessionalism: boolean = null;
  acceptsResponsibility: boolean = null;
  maintainsOpenCommunications: boolean = null;
  hasKRAValues: boolean | null = null; // Initialize to null
  contributionDescription: string = '';

  nomineeError: "";
  currentSchedule: any;
  startDate: any;
  closingDate: any;
  initialStartDate: any;
  scheduleForm: FormGroup;
  isLoading: boolean = false;
  errorDescription:string; 


    @ViewChild('content') content: TemplateRef<any>;
  

   constructor(private httpService: HttpService, private fb: FormBuilder, private dialog: MatDialog,
    private authService: AuthService,private modalService: NgbModal
  ) {
    this.nomineeData = this.fb.group({
      contributionDescription1: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.onDateExtend()
    this.scheduleForm = this.fb.group({
      startDate: [{value: '', disabled:true}, Validators.required,  ], // You can set initial values here if needed
      closingDate: [{value: '', disabled:true},Validators.required]
    });
    this.getNominee()
  }

  onSubmit(event: any): void {
    event.preventDefault();
    const body = { staffNo: this.searchText };
    this.httpService.postData(`${ApiEndPoints.AWARD_NOMINATIONS_SEARCH}`, body,)
      .subscribe({
        next: (res) => {
          // console.log("Response", res)
          this.krastafflist = res.body.data;
          // console.log('krastafflist', this.krastafflist);
          // console.log('name', this.krastafflist.name)
          // console.log(res.status)
          this.status_code = res.status;
          // console.log('status code ', this.status_code);

          if (this.status_code === 200) {
            this.errorMessage = "";
            // this.cd.detectChanges();
            this.specificName = this.krastafflist.name;
            this.department = this.krastafflist.department;
            this.region = this.krastafflist.region;
            this.staff_number = this.krastafflist.staffNo;

          } 
        },
        error: (err) => {
          // console.log('This is the status code', err.status);
          // console.log(err);
          // this.status_code = err.errror.code
          if (err.status === 400 && err.error.data) {
          this.errorMessage = err.error.description;
          this.specificName = err.error.data.name;
          this.department = err.error.data.department;
          this.region = err.error.data.region;
          this.staff_number = err.error.data.staffNo;
          this.errorMessage = err.error.description;
          // this.errorMessage="Data not found. Please contact EIMS administrator on Ext 2825/ 2315 or email: eims@kra.go.ke"
          this.alertMessage = "";
          } 
          else {
          this.specificName = "";
          this.department = "";
          this.region = "";
          this.staff_number = "";
          this.errorMessage = err.error.description;
          // this.errorMessage="Data not found. Please contact EIMS administrator on Ext 2825/ 2315 or email: eims@kra.go.ke"
          // this.alertMessage = "";
          }
      }
      })
  }


  toggleTextVisibility(): void {
    this.specificName = '';
  }

  onConfirm() {
    this.isLoading=false;
    // console.log('status code ', this.status_code);
    if (this.status_code === 200) {
      const staff_name: string = this.specificName;
      this.isConfirmed = true;
      this.errorMessage = "";
      this.alertMessage = `Thank you for confirming, ${staff_name}`;
    
      setTimeout(() => {
        this.alertMessage = ''; 
    }, 5000);
   
    } else if (this.status_code === 400) {
      this.errorDescription=this.errorMessage;
    }
  }

  isConfirmationEnabled(): boolean {
    // Check if all necessary details are filled
    return !!this.staff_number && !!this.specificName;
  }

  onNominate() {
       if (this.isConfirmed && this.areAllFieldsFilled()) {
      this.isLoading=true;
      // Submit the form data
      const nomineeData = {
        integrity: this.convertToNumber(this.integrityAndProfessionalism),
        responsibility: this.convertToNumber(this.acceptsResponsibility),
        communication: this.convertToNumber(this.maintainsOpenCommunications),
        coreValues: this.convertToNumber(this.hasKRAValues),
        description: this.contributionDescription,
        nominee: this.staff_number
      }
      // console.log(nomineeData.nominee)
      // console.log(nomineeData)
      this.httpService.postData(`${ApiEndPoints.AWARD_NOMINATION_STORE}`, nomineeData,)
        .subscribe({
          next: (res) => {
            // console.log(res)
            this.alertMessage = res.body.description
            this.openVerticallyCentered(this.content);
            // window.location.reload();
          },
          complete: () => {
            this.isLoading = false;
          },
          error: (err) => {
            this.nomineeError = err.error.description;
            this.isLoading=false;
            // console.log(this.nomineeError)
          }
        })

    } else if (!this.isConfirmed) {
      
      this.errorMessage = 'Please confirm your selection before nominating';
      // console.log("Please confirm your selection before nominating")
    }
    else {
      // If any field is missing, display an error message or take appropriate action
      // console.log('Please fill in all the fields')
      this.isLoading=false;
      this.missingdetails = "Please fill in all the fields";
      alert("Please fill in all the fields")


    }
  }
 

  areAllFieldsFilled(): boolean {
    return (
      this.integrityAndProfessionalism !== null &&
      this.acceptsResponsibility !== null &&
      this.maintainsOpenCommunications !== null &&
      this.hasKRAValues !== null &&
      this.contributionDescription.trim() !== ''
    );
  }
  private convertToNumber(value: boolean): number {
    return value ? 1 : 0;
  }
  resetForm(): void {
    this.integrityAndProfessionalism = null
    this.acceptsResponsibility = null
    this.maintainsOpenCommunications = null
    this.hasKRAValues = null
    this.contributionDescription = null
    this.specificName = ''
    this.department = ''
    this.region = ''
    this.staff_number = '';
    this.searchText = ''

  }
  openVerticallyCentered(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true });
    
    	}

  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }

  onDateExtend(): void {
    this.httpService.get(ApiEndPoints.AWARD_SCHEDULES_SHOW).subscribe({
      next: (res) => {
        // console.log('This',res)
        this.currentSchedule=res.data;
        // console.log('currentSchedule', this.currentSchedule)
        this.startDate = res.data.startDate;
        this.closingDate = res.data.endDate;
        // This comes as an array of format YYYY/MM/DD
        // console.log('startDate:', this.startDate);
        // console.log('closingDate:', this.closingDate);

        this.startDate = new Date(res.data.startDate);
        this.closingDate = new Date(res.data.endDate);
        this.initialStartDate = this.startDate;
        // console.log('initialStartDate', this.initialStartDate)

        // console.log('New startDate:', this.startDate);
        // console.log('New closingDate:', this.closingDate);
        // console.log(this.scheduleForm)

        this.scheduleForm.patchValue({
          startDate: this.startDate,
          closingDate: this.closingDate,
        });
        // Disable startDate input field
        this.scheduleForm.get('closingDate').disable();
        this.scheduleForm.get('startDate').disable();
      },
      error: (error) => {
        console.error("There was an error!", error);
      },
    });

   }
 getNominee():void{
  this.httpService.get(ApiEndPoints.AWARD_NOMINATION_MYNOMINEE).subscribe({
    next: (res) => {
    //  console.log(res,'respo')
    //  console.log(res.data)
     this.status_code=res.code
    //  console.log("code", this.status_code)
     if (this.status_code == 200) {
      this.nominee=res.data.nominee
      // console.log('nominee', this.nominee) 
    }
    },
    error: (error) => {
  
      this.status_code=error.status
      // console.log( this.status_code, ' this.status_code')
      if (this.status_code == 400) {
        this.nonominee = "You haven't nominated anyone yet";
      }
    },
  });

 }



  isAdmin(): boolean {
    // Check if the user has 'admin' role
    const userRoles = this.authService.getUserRoles();
    return userRoles.includes('ADMIN');
  }
  isUser(): boolean {
    const userRoles = this.authService.getUserRoles();
    return userRoles.includes('USER');
  }



}
