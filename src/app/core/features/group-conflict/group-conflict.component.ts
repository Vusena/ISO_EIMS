import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
import { AuthService } from 'app/core/services/auth.service';
import { HttpService } from 'app/core/services/http.service';

@Component({
  selector: 'app-group-conflict',
  templateUrl: './group-conflict.component.html',
  styleUrls: ['./group-conflict.component.scss'],
  encapsulation: ViewEncapsulation.None // Apply styles globally
})
export class GroupConflictComponent implements OnInit {


  searchText: string = '';
  krastafflist: any;
  specificName: any;
  staffNo: any;
  staffId: number;
  showResultDetails: boolean = false;
  selectedMembers: string[] = [];
  options: string[] = ['Appointing Officer', 'Member '];
  selectedOption = this.options[0];
  option: string;

  status_code: number;
  errorMessage: string;
  loggedInUser: any;
  loggedInUsername: any;

  groupConflictForm: FormGroup;
  today = new Date();
  conflictForm: FormGroup;
  showReasonsDiv = false;

  constructor(private httpService: HttpService, private authService: AuthService, private fb: FormBuilder) {
    this.conflictForm = this.fb.group({
      members: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getLoggedInUser()
    this.groupConflictForm = this.fb.group({
      identityNo: ['', Validators.required],
      date: ['', Validators.required],
      title: ['', Validators.required],
      assignmentDesc: ['', Validators.required],
      venue: ['', Validators.required],
      haveConflict: ['', Validators.required],
      conflictDesc: ['', Validators.required],
      reasons:['',Validators.required],
      legalReqAgreed: ['', Validators.required]
    })

  }

  onSubmit(event: any): void {
    event.preventDefault();
    const body = { staffNo: this.searchText };
    this.httpService.postData(`${ApiEndPoints.GROUP_CONFLICTS_SEARCH}`, body,)
      .subscribe({
        next: (res) => {
          // console.log("Response", res)
          this.krastafflist = res.body.data;
          // console.log('krastafflist', this.krastafflist);
          this.showResultDetails = true; // Set the flag to true
          // console.log('name', this.krastafflist.name)
          // console.log(res.status)
          this.status_code = res.status;
          // // console.log('status code ', this.status_code);

          if (this.status_code === 200) {
            this.errorMessage = "";
            this.specificName = this.krastafflist.name;
            this.staffNo = this.krastafflist.staffNo;
          }
        },
        error: (err) => {
          // console.log('This is the status code', err.status);
          // console.log(err);
          // this.status_code = err.errror.code
          if (err.status === 400) {
            this.errorMessage = err.error.description;

          }
          else {

          }
        }
      })
  }

  // addMember():void{
  //   if (this.specificName) {
  //     const specificNameValue = this.specificName;
  //     this.selectedMembers.push(specificNameValue);
  //     this.specificName = ''; // Reset the specific name
  //     this.showResultDetails = false; // Reset the flag
  //     }
  // }

  // get members(): FormArray {
  //   return this.conflictForm.get('members') as FormArray;
  // }
  addMember(memberData: any): void {
    const memberForm = this.fb.group({
      name: [memberData.name || '', Validators.required],
      option: [memberData.option || '', Validators.required],
      staffNo: [memberData.staffNo || '', Validators.required]
    });
    this.members.push(memberForm);
    console.log('memberData', memberData)
  }

  removeMember(index: number): void {
    this.members.removeAt(index);
  }

  get members(): FormArray {
    return this.conflictForm.get('members') as FormArray;
  }

  isLateDeclaration(): boolean {
    const selectedDate = this.groupConflictForm.get('date').value;
    const today = new Date();
    return selectedDate && selectedDate.getTime() !== today.getTime();
  }


  getLoggedInUser() {
    this.loggedInUser = this.authService.getLoggedInUser();
    if (this.loggedInUser) {
      // console.log(this.loggedInUser)
      this.loggedInUsername = this.loggedInUser.data.name
      // console.log(this.loggedInUsername)
    } else {
      // No user is logged in
    }
  }


  submitGroupConflictDetails() {

    const groupConflictDetails = {
      appointorId: 1,
      identityNo: this.groupConflictForm.get('identityNo').value,
      date: this.groupConflictForm.get('date').value,
      title: this.groupConflictForm.get('title').value,
      assignmentDesc: this.groupConflictForm.get('assignmentDesc').value,
      venue: this.groupConflictForm.get('venue').value,
      haveConflict: this.groupConflictForm.get('haveConflict').value,
      conflictDesc: this.groupConflictForm.get('conflictDesc').value,
      reasons: this.groupConflictForm.get('reasons').value, 
      members: this.groupConflictForm.get('members').value
    }
  }


  validate(): void {
    console.log('Members:', this.members.value);
    let isValid = true;
    let appointingOfficerCount = 0;
    let allStaffNumbers = [];
    // Iterate over each FormGroup in the FormArray
    this.members.controls.forEach((group: FormGroup) => {
      // Check if the 'option' control has a value
      if (!group.get('option').value) {
        this.errorMessage = ('Please select an option for all members.');
        isValid = false;
        return;
      }
      // Store the staff number for each member
      allStaffNumbers.push(group.get('staffNo').value);
      // console.log(allStaffNumbers)
      // Count how many times 'Appointing Officer' has been selected
      if (group.get('option').value === 'Appointing Officer') {
        appointingOfficerCount++;

      }
      // Check if 'Appointing Officer' has been selected more than once
      if (appointingOfficerCount > 1) {
        this.errorMessage = 'The "Appointing Officer"  can only be selected once.';
        isValid = false;
      }
    });


    // If all options are selected, proceed with further validation
    if (isValid) {
      // Additional validation logic...
      console.log('All members have selected an option.');
      this.errorMessage = '';
    }


  }
}

