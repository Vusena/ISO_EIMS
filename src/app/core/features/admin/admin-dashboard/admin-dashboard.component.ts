import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
import { HttpService } from 'app/core/services/http.service';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent implements OnInit {

  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('nocontent') nocontent: TemplateRef<any>;
  @ViewChild('content') yescontent: TemplateRef<any>; 
  @ViewChild('colreview') colreview:TemplateRef<any>;

  Roles: any;
  Priviledges: any;
  selectedRole: any;
  rolesAndPrivileges: any;
  roleName: any;
  retrievedPrivileges: any;
  searchResults: any[];
  searchControl = new FormControl('');
  filteredResults: any[];
  selectedUser: any;
  members: any[] = [];
  isUserSelected: boolean = false;
  isSelected: boolean = false;
  foundRole: any;
  isCheckedPriviledge: boolean = false;
  status_code: any;
  alertMessage: string;
  errorMessage: string;
   privileges:any[];
   
  isRequestSuccessful: boolean = false;

  declarationForm:FormGroup;
  notifications: any[] = [];
  headers: any;
  title: any;
  description: any;
  selectedNotification: any;
  showLateDeclarationUI: boolean; 
  conflictOfInterest: any;
  conflictOfInterestControl = new FormControl(null);
  assignmentId: number;
  date: any;
  remarksForm: FormGroup;
  isLoading: boolean = false; 

  constructor(private httpService: HttpService, private modalService: NgbModal, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.searchResults = [];
    this.getUserRoles();
    this.getUserPriviledges();
    this.getRolesAndPrivileges();
    this.getNotifications();
    this.searchControl.valueChanges
      // .pipe(startWith(''), debounceTime(300), distinctUntilChanged())
      .subscribe((searchInput: string) => {
        this.getSearchedUser(searchInput);
        // console.log('searchResults:', this.searchResults);
        // console.log('searchInput:', searchInput);
        this.filteredResults = this.searchResults.filter((result: any) =>
          result.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
          result.staffNo.toString().includes(searchInput) ||
          result.lastName.toLowerCase().includes(searchInput.toLowerCase()) ||
          result.phone.includes(searchInput.toLowerCase())
        );
        // console.log('Filtered Results:', this.filteredResults);
      }); 
      this.declarationForm = this.fb.group({
        file: ['',],
        identityNo: ['',],
        description: ['',],
        reasons: ['',]
      }) 
      this.remarksForm = this.fb.group({
        remarks:['', Validators.required]
      })

  }

  getUserRoles(): void {
    this.httpService.get(ApiEndPoints.ROLES_INDEX).subscribe({
      next: (res) => {
        // console.log(res)
        this.Roles = res.data;
        // console.log('Roles', this.Roles);
        const roleNames = this.Roles.map(role => role.name);
        // console.log('Role Names', roleNames);
        const rolePrivileges = this.Roles.map(role => role.privileges);
        // console.log('Role Privileges', rolePrivileges);

      },
      error: (error) => {
        // console.error("There was an error!", error);
      },
    });
  }

  getUserPriviledges(): void {
    this.httpService.get(ApiEndPoints.PRIVILEDGES_INDEX).subscribe({
      next: (res) => {
        // console.log(res)
        this.Priviledges = res.data
        // console.log('Privileges', this.Priviledges);
        //   const serverPrivileges = this.Priviledges.map(role => role.name);
        // console.log('serverPrivileges', serverPrivileges);
      },
      error: (error) => {
        // console.error("There was an error!", error);
      },
    });
  }

  getRolesAndPrivileges(): void {
    this.httpService.get(ApiEndPoints.ROLES_SHOW).subscribe({
      next: (res) => {
        // console.log(res)
        this.rolesAndPrivileges = res.data
        // console.log('RolesAndPrivileges', this.rolesAndPrivileges);
      },
      error: (error) => {
        // console.error("There was an error!", error);
      },
    });
  }

  //  We get the name of the role then get the privileges associated with that role
  getPrivileges(roleName: string): any[] {
    if (roleName) {
      const role = this.Roles.find(r => r.name === roleName);
      if (role) {
        this.retrievedPrivileges = role.privileges;
        this.selectedRole = role;
        // console.log('Roles, initial role from the server', this.selectedRole);
        // console.log('Retrieved Privileges', this.retrievedPrivileges);
        this.updateSelectedRoleUI();
      }
    }
    return this.retrievedPrivileges
  }

  updateSelectedRoleUI(): void {
    // Unselect previously selected role
    if (this.selectedRole) {
        // Loop through all roles to unselect them
        this.Roles.forEach(r => r.isSelected = false);
        // Select the current role
        this.selectedRole.isSelected = true;
        // console.log('Roles, Updated selected role', this.selectedRole);
    }
}


  isChecked(privilege): boolean {
    if (this.selectedRole) {
      return this.selectedRole.privileges.some(
        (rolePrivilege) => rolePrivilege.id === privilege.id
      );
    }
    if (this.foundRole) {
      return this.foundRole.privileges.some(
        (foundRole) => foundRole.id === privilege.id
      );
    }

    return false;
  }

  getSearchedUser(search: string): void {
    this.httpService.getSearchedUser(ApiEndPoints.SEARCH_USERS_GET, { key: "filter", value: search }).subscribe({
      next: (res) => {
        // console.log(res)
        this.searchResults = res.data
        // console.log('searchResults', this.searchResults);
      },
      error: (error) => {
        // console.error("There was an error!", error);
      },
    });
  }

  onSelectUser(result: any) {
    this.selectedUser = result;
    // console.log('selectedUser', this.selectedUser);
    this.isUserSelected = true;
        this.addMember(this.selectedUser);
    if (this.selectedUser.roles && this.selectedUser.roles.length > 0) {
      // Iterate over each role in selectedUser.roles
      for (const selectedRole of this.selectedUser.roles) {
        // Find the corresponding role in this.Roles by name
        this.foundRole = this.Roles.find(role => role.name === selectedRole.name);
        // Log the foundRole
        // console.log('foundRole', this.foundRole);
        // Do further processing with foundRole if needed

        if (this.foundRole) {
          this.foundRole.isSelected = true;
        }
        this.privileges = this.foundRole.privileges.map(privilege => privilege.id);
        // console.log('privileges', this.privileges);
        // Iterate over privileges of foundRole
        for (const privilege of this.foundRole.privileges) {
          // Set the isChecked property of each privilege to true
          privilege.isCheckedPriviledge = true;
        }
      }
 
    } else {
      // console.log('No roles found for selectedUser');
    }
   
  }

  addMember(seletedUser: any) {
    this.members = [];
  // Add the new user to the members array
      this.members.push(seletedUser);
    // this.selectedUser = null;
    // console.log('members', this.members)
  }

  onClearSearchInput() {
    this.searchControl.setValue('');
    this.isUserSelected = false;
    this.members = [];
    this.selectedUser = [];
    this.filteredResults = [];
    // this.selectedRole = []; // Assuming selectedRoles is the array storing selected roles
  }

  // SUBMITTING TO THE SERVER

  onSubmitRoleAssignee() {
    if (this.selectedUser && this.foundRole) {
           const roleData = {
        userId: this.selectedUser.id,
        roleId: this.selectedRole.id,
        privileges: this.privileges,

      };
      // console.log('roleData',roleData)
      // console.log('roleData', roleData)
      this.httpService.postData(`${ApiEndPoints.ROLES_CREATE}`, roleData,)
        .subscribe({
          next: (res) => {
            this.status_code = res.status;
            // console.log(res);
            // console.log('status code ', this.status_code);
            if (this.status_code === 200) {
              this.isRequestSuccessful = true;
              this.alertMessage = res.body.description;
              setTimeout(() => {
                this.alertMessage = '';
                this.onClearSearchInput();
                // Reload the page after 3 seconds
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              }, 3000);
              } else {
            }
          },
          error: (err) => {
            // console.log(err.error.description);
            this.errorMessage = err.error.description;
          }
        })
    }
  }
 
  openVerticallyCentered(content: TemplateRef<any>, notification: any) {
    this.modalService.open(content, { centered: true, });
    this.selectedNotification = notification;
    this.assignmentId = notification.assignmentId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const notificationDateArray = notification.date;
    const notificationDate = new Date(notificationDateArray[0], notificationDateArray[1] - 1, notificationDateArray[2]);    
    this.date=notificationDate
    if (notificationDate < today) {
      this.showLateDeclarationUI = true;             
       this.declarationForm = this.fb.group({
        file: ['',Validators.required],
        identityNo: ['', ],
        description: ['',],
        reasons: ['',Validators.required]
      })
    } else {
      this.showLateDeclarationUI = false;
      this.declarationForm = this.fb.group({     
        identityNo: ['', Validators.required], 
        file: ['',],     
        description: ['',],
        reasons: ['',]    
      }) 
    }
    this.preselectNoButton();
  }
  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }

  onNoConflictClick(): void {
    // this.modalService.dismissAll();
    // this.modalService.open(nocontent, { centered: true, })    
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    if (noButton && yesButton) {
      noButton.classList.add('selected');
      yesButton.classList.remove('selected');
    }
    this.conflictOfInterestControl.setValue(0);
  }
  noConflictClick(content: TemplateRef<any>): void {
    this.modalService.dismissAll();
    this.modalService.open(content, { centered: true, })
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    if (noButton && yesButton) {
      noButton.classList.add('selected');
      yesButton.classList.remove('selected');
    }
    this.conflictOfInterestControl.setValue(0);
  }

  onConflictClick(yescontent: TemplateRef<any>): void {
    this.modalService.dismissAll();
    this.modalService.open(yescontent, { centered: true, })
    this.conflictOfInterest = 1;
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    if (noButton && yesButton) {
      yesButton.classList.add('selected');
      noButton.classList.remove('selected');
    }
    this.conflictOfInterestControl.setValue(1);
    this.preselectYesButton();
    this.declarationForm = this.fb.group({
      file: ['',],
      identityNo: ['', Validators.required],
      description: ['', Validators.required],
      reasons: ['',]
    })
    // console.log(this.date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (this.date < today) {
      this.showLateDeclarationUI = true;       
       this.declarationForm = this.fb.group({
        file: ['',Validators.required],
        identityNo: ['',Validators.required ],
        description: ['',Validators.required],
        reasons: ['',Validators.required]
      })
    }     
  }

  yesConflictClick(): void {
    this.conflictOfInterestControl.setValue(1);
  }

  preselectNoButton(): void {
    const noButton = document.getElementById('noButton');
    if (noButton) {
      noButton.classList.add('selected');
    }
  }
  preselectYesButton(): void {
    const ybutton = document.getElementById('ybutton');
    if (ybutton) {
      ybutton.classList.add('selected');
    }
  }

  getNotifications(): void {
    this.httpService.get(ApiEndPoints.GET_NOTIFICATIONS).subscribe({
      next: (response) => {
        this.notifications = response.data
        console.log(this.notifications)
      },
      error: (error) => {
        console.error("There was an error!", error);
      },
    })
  }

  submitDeclarations(): void {
    this.isLoading=true;
    let haveConflict = 0;
    const formData = new FormData();
    if (this.conflictOfInterestControl.value !== null && this.conflictOfInterestControl.value !== undefined) {
      haveConflict = this.conflictOfInterestControl.value;
    }
    if (this.assignmentId) {
      const declaration = {
        assignmentId: this.assignmentId,
        identityNo: this.declarationForm.get('identityNo').value,
        haveConflict: haveConflict,
        description: this.declarationForm.get('description').value,
        reasons: this.declarationForm.get('reasons').value
      };
      // console.log(declaration)
      formData.append('declaration', JSON.stringify(declaration));
      formData.append('file', this.declarationForm.get('file').value);
      this.httpService.postData(`${ApiEndPoints.DECLARATION_POST}`, formData,).subscribe({
        next: (response) => {
          // console.log(response)
          this.modalService.dismissAll();
          // this.declarationForm.reset()
          this.openSuccessModal(this.nocontent)
        },
        complete: () => {
          this.isLoading = false;
        },
        error: (error) => {
          console.error("There was an error!", error);
          this.isLoading=false;
        },
      })
    }     
  }

  checkAction(notification) {
    switch (notification.action) {
      case 'CoIGReview':
        this.openCoIGReviewModal(this.colreview, notification);
        break;
      case 'CoIGDeclare':
        this.openVerticallyCentered(this.content, notification);
        break;
      // add more cases for other actions
      default:
        console.log('Unknown action');
    }
  }
  openCoIGReviewModal(colreview: TemplateRef<any>, notification: any) {    
    this.selectedNotification = notification;   
    this.modalService.open(colreview, { centered: true, });    
  }

  cancelDeclarations(): void { 
    this.declarationForm.reset();   
    this.declarationForm.patchValue({
      description: '',
      file: '',
      identityNo: '',
      reasons: ''
    });   
  }
  
  handleFileInput(files: FileList): void {
    if (files.length > 0) {
      // If only one file is allowed, use the first file in the list
      const file = files.item(0);
      this.declarationForm.get('file').setValue(file);
    }
  }
  openSuccessModal(nocontent: TemplateRef<any>) {
    this.modalService.open(nocontent, { centered: true });
  }
  submitRemarks():void{   
    const remarksData= {
    declarationId: this.selectedNotification.declarationId,
    status: "REVIEWED",
    remarks: this.remarksForm.get('remarks').value
    };   
    this.httpService.postData(ApiEndPoints.REMARKS_POST, remarksData).subscribe({
      next: (response) => {      
        this.modalService.dismissAll();    
        this.openSuccessModal(this.nocontent);
        this.remarksForm.reset()
      },
      error: (error) => {
        console.error("There was an error!", error);
      },
    });
  }
  cancelRemarks(): void { 
    this.remarksForm.reset();       
  }
}

