import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  @ViewChild('content') content: TemplateRef<any>;

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
  selectedFile: File | null = null;
  giftForm: any;

  constructor(private httpService: HttpService, private authService: AuthService, private datePipe: DatePipe, private fb: FormBuilder,
    private modalService: NgbModal) {
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
      reasons: ['',],
      file: ['',],
      legalReqAgreed: ['', Validators.required]
    })
  }

  onSubmit(event: any): void {
    event.preventDefault();
    const body = { staffNo: this.searchText };
    this.httpService.postData(`${ApiEndPoints.GROUP_CONFLICTS_SEARCH}`, body,)
      .subscribe({
        next: (res) => {
          this.krastafflist = res.body.data;
          this.showResultDetails = true;
          this.status_code = res.status;
          if (this.status_code === 200) {
            this.errorMessage = "";
            this.specificName = this.krastafflist.name;
            this.staffNo = this.krastafflist.staffNo;
          }
        },
        error: (err) => {

          if (err.status === 400) {
            this.errorMessage = err.error.description;

          }
          else {

          }
        }
      })
  }
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
    const selectedDate = new Date(this.groupConflictForm.get('date').value);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
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
    const membersData = this.members.value;
    // console.log("MEMBERS DATA", membersData)
    const staffNumbers = membersData.map(member => member.staffNo);
    // console.log(staffNumbers)

    const formData = new FormData();
    let haveConflictNumber;
    const formattedDate = this.datePipe.transform(this.groupConflictForm.get('date').value, 'yyyy-MM-dd');
    const haveConflictValue = this.groupConflictForm.get('haveConflict').value;
    if (haveConflictValue === 'yes') {
      haveConflictNumber = 1;
    } else {
      haveConflictNumber = 2;
    }

    const declaration = {
      appointorId: '1',
      identityNo: this.groupConflictForm.get('identityNo').value,
      date: formattedDate,
      title: this.groupConflictForm.get('title').value,
      assignmentDesc: this.groupConflictForm.get('assignmentDesc').value,
      venue: this.groupConflictForm.get('venue').value,
      haveConflict: haveConflictNumber,
      conflictDesc: this.groupConflictForm.get('conflictDesc').value,
      reasons: this.groupConflictForm.get('reasons').value,
      members: staffNumbers
    };

    formData.append('declaration', JSON.stringify(declaration));
    formData.append('file', this.groupConflictForm.get('file').value);

    this.httpService.postData(ApiEndPoints.GROUP_CONFLICTS_INITIATE, formData).subscribe({
      next: (response) => {
        console.log(response);
        this.groupConflictForm.reset();
        this.openVerticallyCentered(this.content);
      },
      error: (error) => {
        console.error("There was an error!", error);
      },
    });
  }

  validate(): void {
    // const membersData = this.members.value;
    // console.log("MEMBERS DATA", membersData)
    // const staffNumbers = membersData.map(member => member.staffNo);
    // console.log('staffNumbers', staffNumbers)
    // console.log('Members:', this.members.value);
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

  handleFileInput(files: FileList): void {
    if (files.length > 0) {
      // If only one file is allowed, use the first file in the list
      const file = files.item(0);
      this.groupConflictForm.get('file').setValue(file);
    }

  }
  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });

  }
  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }

}