import { DatePipe } from '@angular/common';
import { Component, OnInit, signal, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/core/services/auth.service';
import { PreviewComponent } from '../common/preview/preview.component';
import { Constants } from "../../utils/constants";
import { HttpsService } from "../../services/https.service";
import { PageEvent } from "@angular/material/paginator";
import { HttpParams } from "@angular/common/http";
import { NotificationService } from 'app/core/services/notification.service';

@Component({
  selector: 'app-group-conflict',
  templateUrl: './group-conflict.component.html',
  styleUrls: ['./group-conflict.component.scss'],
  encapsulation: ViewEncapsulation.None // Apply styles globally
})
export class GroupConflictComponent implements OnInit {
  history: any;
  page = 0;
  size = 4;
  length = 0;
  progress: any;
  declaration: any;

  declarationDate = new Date();
  user: any;
  username: string;
  roles: string[] = ['Appointing Officer', 'Member'];
  selectedRole: string = 'Chairperson';
  option: string;

  searchText: string = '';

  alertSearch = {
    type: "success",
    isOpen: false,
    title: 'Hurray!',
    message: ""
  }

  alertSubmit = {
    type: "success",
    isOpen: false,
    title: 'Hurray!',
    message: ""
  }

  showSearchResults = false;
  staffName: any;
  staffNo: any;

  isValidated = false;
  historyItemClicked = false;
  isLoading = false;
  hideButtons = true;
  backButtonControl = false;
  previewed = false;

  noButton: any;
  yesButton: any;

  appointor: any;
  members = [];

  membersForm: FormGroup;
  declarationForm: FormGroup;

  haveConflict = false;
  isLateDeclaration = false

  @ViewChild('content') content: TemplateRef<any>;
  readonly panelOpenState = signal(false);

  constructor(
    private service: HttpsService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {
    this.membersForm = this.fb.group({
      membersFormFields: this.fb.array([])
    });
  }

  ngOnInit(): void {
   
    this.notificationService.getNotifications(); 
    this.noButton = document.getElementById('noButton');
    this.yesButton = document.getElementById('yesButton');

    this.conflictButton();
    this.getUser();
    this.getHistory();

    this.declarationForm = this.fb.group({
      identityNo: ['', [
        Validators.required,
        Validators.pattern('^[A-Z0-9]*$'),
        Validators.minLength(6),
        Validators.maxLength(8)
      ]],
      date: ['', Validators.required],
      title: ['', Validators.required],
      assignmentDesc: ['', Validators.required],
      venue: ['', Validators.required],
      conflictDesc: ['',],
      reasons: ['',],
      file: ['',],
      agree: [false, Validators.requiredTrue]
    })
    // Subscribe to date changes
    this.declarationForm.get('date').valueChanges.subscribe(() => {
      this.isLateDeclaration = this.compareDates()
      this.updateValidators();
    });

    this.progress = [
      // Add default objects representing the initial state of each step
      { actor: 'Once you declare', action: 'This will be your progress bar to track which stage the declaration is at.' },
      { actor: '', action: '' },
    ];
  }

  updateValidators() {
    const reasonsControl = this.declarationForm.get('reasons');
    const fileControl = this.declarationForm.get('file');
    const conflictDescControl = this.declarationForm.get('conflictDesc');

    if (this.isLateDeclaration) {
      reasonsControl.setValidators(Validators.required);
      fileControl.setValidators(Validators.required);
    } else {
      reasonsControl.clearValidators();
      fileControl.clearValidators();
    }

    if (this.haveConflict) {
      conflictDescControl.setValidators(Validators.required);
    } else {
      conflictDescControl.clearValidators();
    }

    reasonsControl.updateValueAndValidity();
    fileControl.updateValueAndValidity();
    conflictDescControl.updateValueAndValidity();
  }

  getUser(): void {
    this.user = this.authService.getLoggedInUser();
    this.username = this.user.data.name
  }

  getHistory() {
    const params = new HttpParams({
      fromObject: { page: this.page, size: this.size }
    });

    this.service.get(`${Constants.BASE_URL}/coi-group/history`, params).subscribe({
      next: (response: any) => {
        this.history = response.data.content;
        this.length = response.data.totalElements;
      },
      error: () => { },
    });
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.size = e.pageSize;
    this.page = e.pageIndex;
    this.getHistory();
  }

  onSearch(event: any): void {
    event.preventDefault();
    const data = { staffNo: this.searchText };
    this.service.post(`${Constants.BASE_URL}/coi-group/search`, data).subscribe({
      next: (response: any) => {
        let staff = response.data;
        this.showSearchResults = true;
        this.staffName = staff.name;
        this.staffNo = staff.staffNo;
      },
      error: (error) => {
        this.alertSearch.message = error.message;
        this.alertSearch.title = "Oops!";
        this.alertSearch.type = "danger";

        this.alertSearch.isOpen = true;
      }
    })
  }

  onCloseAlertSearch(): void {
    this.alertSearch.isOpen = false;
  }

  attachStaff(staff: any): void {
    const exists = this.membersFormFields.value.find((member: { staffNo: any; }) => member.staffNo === staff.staffNo);

    if (exists) {
      this.alertSearch.message = `Staff number ${staff.staffNo} is already added.`;
      this.alertSearch.title = "Oops!";
      this.alertSearch.type = "danger";
      this.alertSearch.isOpen = true;

      //return;
    } else {
      const memberFormField = this.fb.group({
        name: [staff.name || '', Validators.required],
        option: [staff.option || '', Validators.required],
        staffNo: [staff.staffNo || '', Validators.required]
      });

      this.membersFormFields.push(memberFormField);
      this.showSearchResults = false;
      this.searchText = "";
    }
  }

  detachStaff(index: number): void {
    this.membersFormFields.removeAt(index);
  }

  get membersFormFields(): FormArray {
    return this.membersForm.get('membersFormFields') as FormArray;
  }

  validateMembers(): void {
    this.isLoading = false
    // const membersData = this.members.value;
    // console.log("MEMBERS DATA", membersData)
    // const staffNumbers = membersData.map(member => member.staffNo);
    // console.log('staffNumbers', staffNumbers)

    let appointorCount = 0;
    let membersCount = 0;
    this.members = [];

    // Check if at least one member has been added
    if (this.membersFormFields.length > 0) {

      let assignedRoles = false;

      // Iterate over each FormGroup in the FormArray
      this.membersFormFields.controls.forEach((group: FormGroup) => {
        // Check if the 'option' control has a value
        if (!group.get('option').value) {
          assignedRoles = true
        }

        if (group.get('option').value === 'Appointing Officer') {
          this.appointor = group.get('staffNo').value;
          appointorCount++;
        }

        if (group.get('option').value === 'Member') {
          let staffNo = group.get('staffNo').value

          if (!this.members.includes(staffNo)) {
            this.members.push(staffNo);
          }

          membersCount++;
        }
      });

      // If each member has been assigned a role
      if (!assignedRoles) {

        if (appointorCount == 0) {

          this.isValidated = false;

          this.alertSearch.message = "Please add an Appointing Officer.";
          this.alertSearch.title = "Oops!";
          this.alertSearch.type = "danger";
          this.alertSearch.isOpen = true;

        } else if (membersCount < 1) {

          this.isValidated = false;

          this.alertSearch.message = "You should at least add one member.";
          this.alertSearch.title = "Oops!";
          this.alertSearch.type = "danger";
          this.alertSearch.isOpen = true;

        } else if (appointorCount > 1) {

          this.isValidated = false;

          this.alertSearch.message = "You can only have one Appointing Officer.";
          this.alertSearch.title = "Oops!";
          this.alertSearch.type = "danger";
          this.alertSearch.isOpen = true;

        } else {
          this.isValidated = true;

          this.alertSearch.message = "You have successfully added members to the Group Assignment.";
          this.alertSearch.title = "Hurray!";
          this.alertSearch.type = "success";
          this.alertSearch.isOpen = true;
        }
      } else {

        this.isValidated = false;

        this.alertSearch.message = "Please assign role for each of the members..";
        this.alertSearch.title = "Oops!";
        this.alertSearch.type = "danger";
        this.alertSearch.isOpen = true;
      }
    } else {

      this.isValidated = false;

      this.alertSearch.message = "Please add members to the Group Assignment.";
      this.alertSearch.title = "Oops!";
      this.alertSearch.type = "danger";

      this.alertSearch.isOpen = true;
    }
  }

  compareDates(): boolean {
    const selectedDate = new Date(this.declarationForm.get('date').value);
    selectedDate.setHours(0, 0, 0, 0);
    const declarationDate = new Date(this.declarationDate);
    declarationDate.setHours(0, 0, 0, 0);
    return selectedDate < declarationDate;
  }

  onConflictClick(value: boolean): void {
    this.haveConflict = value
    this.conflictButton()
    this.updateValidators();
  }

  conflictButton(): void {
    if (this.haveConflict) {
      this.yesButton.classList.add('selected');
      this.noButton.classList.remove('selected');
    } else {
      this.noButton.classList.add('selected');
      this.yesButton.classList.remove('selected');
    }
  }

  submit(): void {
    this.alertSearch.isOpen = false;
    this.validateMembers(); // Re-validate the form data before submitting
    if (this.isValidated) {
      this.previewed ? this.post() : this.preview();
    }
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
    
    const formValues = this.declarationForm.getRawValue();
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
        value: this.user.data.grade.description,
        class: "col-sm-6 pb-1"
      },
      {
        label: "ID/Passport Number",
        value: formValues.identityNo,
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
        label: "GROUP MEMBER DETAILS",
        class: "col-12 text-center mt-3 h5"
      }
    ]

    const members = this.membersFormFields.value;

    if (members && members.length > 0) {
      members.forEach((member: any) => {
        data.push({
          label: `Name:`,
          value: member.name,
          class: "col-sm-4 pb-1",
        });
        data.push({
          label: `Role:`,
          value: member.option,
          class: "col-sm-4 pb-1",
        });
        data.push({
          label: `Staff No.:`,
          value: member.staffNo,
          class: "col-sm-4 pb-1",
        });
      });
    }

    //ASSIGNMENT DETAILS
    data.push({
      label: "ASSIGNMENT DETAILS",
      class: "col-12 text-center mt-3 h5"
    })
    data.push({
      label: "Title:",
      value: formValues.title,
      class: "col-sm-6 pb-1"
    });
    data.push({
      label: "Venue:",
      value: formValues.venue,
      class: "col-sm-6 pb-1"
    });
    data.push({
      label: "Assignment Date:",
      value: this.datePipe.transform(formValues.date, 'dd-MM-yyyy'),
      class: "col-sm-6 pb-1"
    });
    data.push({
      label: "Declaration Date:",
      value: this.datePipe.transform(this.declarationDate, 'dd-MM-yyyy'),
      class: "col-sm-6 pb-1"
    });
    data.push({
      label: "Description:",
      value: formValues.assignmentDesc,
      class: "col-sm-12 pb-1"
    });

    data.push({
      label: "DECLARATION DETAILS",
      class: "col-12 text-center mt-3 h5"
    })

    if (formValues.conflictDesc) {
      data.push({
        label: "Conflict Description:",
        value: formValues.conflictDesc,
        class: "col-sm-12 pb-1"
      });
    } else {
      data.push({
        label: "Conflict Description:",
        value: "No conflict of interest",
        class: "col-sm-12 pb-1"
      });
    }

    if (formValues.reasons) {
      data.push({
        label: "Reasons for Late Declaration:",
        value: formValues.reasons,
        class: "col-sm-12 pb-1"
      });
    }
    // if (formValues.file) {
    //   const filePath = formValues.file.filePath; // Get the file URL
    //   data.push({
    //     label: "File",
    //     value: `<img src="${filePath}" alt="Uploaded file" />`, // Display the file as an image
    //     class: "col-sm-12"
    //   });
    // }

    const modalRef = this.modalService.open(PreviewComponent, { centered: true });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      this.previewed = result;
    });
  }

  post() {
    this.isLoading = true;
    const formValues = this.declarationForm.getRawValue();
    const declaration = {
      appointor: this.appointor,
      identityNo: formValues.identityNo,
      date: this.datePipe.transform(formValues.date, 'yyyy-MM-dd'),
      title: formValues.title,
      assignmentDesc: formValues.assignmentDesc,
      venue: formValues.venue,
      haveConflict: this.haveConflict,
      conflictDesc: formValues.conflictDesc,
      reasons: formValues.reasons,
      members: this.members
    };

    const formData = new FormData();
    formData.append('declaration', JSON.stringify(declaration));
    formData.append('file', this.declarationForm.get('file').value);

    this.service.post(`${Constants.BASE_URL}/coi-group/initiate`, formData).subscribe({
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
        this.alertSubmit.message = error.message;
        this.alertSubmit.title = "Oops!";
        this.alertSubmit.type = "danger";
        this.alertSubmit.isOpen = true;
      },
    });
  }

  onFileChange(event: { target: HTMLInputElement; }): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.declarationForm.patchValue({
      file: file
    });
    //this.declarationForm.get('file').setValue(file);
    this.declarationForm.get('file').updateValueAndValidity();
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  onCloseAlertSubmit(): void {
    this.alertSubmit.isOpen = false;
  }

  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }

  onHistoryItemClick(url: string): void {
    this.historyItemClicked = true;
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

        this.declarationForm.patchValue({
          identityNo: this.declaration.declarant_id_no,
          date: date,
          title: this.declaration.assignment_title,
          assignmentDesc: this.declaration.assignment_description,
          venue: this.declaration.venue,
          conflictDesc: this.declaration.description,
          reasons: this.declaration.reasons,
          file: this.declaration.filePath
        });

        this.haveConflict = this.declaration.haveConflict
        this.conflictButton()

        this.declarationDate = this.declaration.date_declared
        this.compareDates()

        this.declarationForm.disable()
      },
      error: () => { },
    });
  }

  clear(): void {
    this.declarationForm.reset();
    this.historyItemClicked = false;
    this.haveConflict = false;
    this.isLateDeclaration = false
  }

  backButton() {
    location.reload();
    
  }
}
