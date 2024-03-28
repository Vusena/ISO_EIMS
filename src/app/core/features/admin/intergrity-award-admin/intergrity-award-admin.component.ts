import { Component, TemplateRef, inject } from '@angular/core';
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
export class IntergrityAwardAdminComponent {
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

  integrityAndProfessionalism: boolean = null;
  acceptsResponsibility: boolean = null;
  maintainsOpenCommunications: boolean = null;
  hasKRAValues: boolean | null = null; // Initialize to null
  contributionDescription: string = '';

  nomineeError: "";

    @ViewChild('content') content: TemplateRef<any>;

  constructor(private httpService: HttpService, private fb: FormBuilder, private dialog: MatDialog,
    private authService: AuthService,private modalService: NgbModal
  ) {
    this.nomineeData = this.fb.group({
      contributionDescription1: ['', Validators.required]
    });
  }

  onSubmit(event: any): void {
    event.preventDefault();
    const body = { staffNo: this.searchText };
    this.httpService.postData(`${ApiEndPoints.AWARD_NOMINATIONS_SEARCH}`, body,)
      .subscribe({
        next: (res) => {
          console.log("Response", res)
          this.krastafflist = res.body.data;
          console.log('krastafflist', this.krastafflist);
          console.log('name', this.krastafflist.name)
          console.log(res.status)
          this.status_code = res.status;
          console.log('status code ', this.status_code);

          if (this.status_code === 200) {
            this.errorMessage = "";
            // this.cd.detectChanges();
            this.specificName = this.krastafflist.name;
            this.department = this.krastafflist.department;
            this.region = this.krastafflist.region;
            this.staff_number = this.krastafflist.staffNo;

          } else {

          }
        },
        error: (err) => {
          console.log(err.error.description);
          this.specificName = err.error.data.name;
          this.department = err.error.data.department;
          this.region = err.error.data.region;
          this.staff_number = err.error.data.staffNo;
          this.errorMessage = err.error.description;
          this.alertMessage = "";
          setTimeout(() => {
            this.errorMessage = ''; // Clear the error message after 3 minutes
          }, 3000);
          console.log(this.errorMessage);

        }
      })
  }

  toggleTextVisibility(): void {
    this.specificName = '';
  }

  onConfirm() {
    if (this.status_code === 200) {
      const staff_name: string = this.specificName;
      this.isConfirmed = true;
      this.errorMessage = "";
      this.alertMessage = `Thank you for confirming, ${staff_name}`;
      setTimeout(() => {
        this.alertMessage = ''; // Clear the alert message
      }, 3000);
    } else {
      // Display an error message or handle the case where status code is not 200
      this.errorMessage = "You are allowed to nominate users only within your region ";
      setTimeout(() => {
        this.errorMessage = ''; // Clear the error message after 3 minutes
      }, 3000);
    }
  }
  isConfirmationEnabled(): boolean {
    // Check if all necessary details are filled
    return !!this.staff_number && !!this.specificName;
  }

  onNominate() {
    if (this.isConfirmed && this.areAllFieldsFilled()) {
      // Submit the form data
      const nomineeData = {
        integrity: this.convertToNumber(this.integrityAndProfessionalism),
        responsibility: this.convertToNumber(this.acceptsResponsibility),
        communication: this.convertToNumber(this.maintainsOpenCommunications),
        coreValues: this.convertToNumber(this.hasKRAValues),
        description: this.contributionDescription,
        nominee: this.staff_number
      }
      console.log(nomineeData.nominee)
      console.log(nomineeData)
      this.httpService.postData(`${ApiEndPoints.AWARD_NOMINATION_STORE}`, nomineeData,)
        .subscribe({
          next: (res) => {
            console.log(res)
            this.alertMessage = res.body.description
            setTimeout(() => {
              this.alertMessage = ''; // Clear the alertMessage
            }, 3000);
            this.openVerticallyCentered(this.content);
            // this.showModal();
            //  this.successAlert();
            //    setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
          },
          error: (err) => {
            this.nomineeError = err.error.description;
            console.log(this.nomineeError)
          }
        })

    } else if (!this.isConfirmed) {
      this.errorMessage = 'Please confirm your selection before nominating';
      console.log("Please confirm your selection before nominating")
    }
    else {
      // If any field is missing, display an error message or take appropriate action
      console.log('Please fill in all the fields')
      this.missingdetails = "Please fill in all the fields";
      alert("Please fill in all the fields")


    }
  }
  successAlert(): void { }

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
    return value ? 1 : 2;
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
