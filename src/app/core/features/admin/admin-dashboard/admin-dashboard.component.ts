import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
import { HttpService } from 'app/core/services/http.service';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import {Constants} from "../../../utils/constants";
import {HttpParams} from "@angular/common/http";
import {HttpsService} from "../../../services/https.service";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../../services/auth.service";

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
  @ViewChild('CoIISupReview') CoIISupReview:TemplateRef<any>;

  user: any;
  history: any;
  page = 0;
  size = 4;
  length = 0;
  progress: any;
  declaration: any;
  
  statistics = {
    individualConflict: {
      statuses: [],
      total: 0
    },
    giftsGivenOut: {
      statuses: [],
      total: 0
    },
    groupConflict: {
      statuses: [],
      total: 0
    },
    giftsReceived: {
      statuses: [],
      total: 0
    }
  }  
  historyItemClicked = false;

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
  isSubmitting = false;

  constructor(
    private httpService: HttpService,
    private service: HttpsService,
    private authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.searchResults = [];
    this.getUserRoles();
    this.getUserPriviledges();
    this.getRolesAndPrivileges();
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

    this.getUser();
    this.getHistory();
    this.getStatistics();
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

  getUser(): void {
    this.user = this.authService.getLoggedInUser();
  }

  getStatistics():void{
    this.service.get(`${Constants.BASE_URL}/dashboard/statistics`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.statistics = response.data
      },
      error: () => {},
    })
  }

  getHistory() {
    const params = new HttpParams({
      fromObject: { page: this.page, size: this.size }
    });

    this.service.get(`${Constants.BASE_URL}/dashboard/declarations`, params).subscribe({
      next: (response: any) => {
        this.history = response.data.content;
        this.length = response.data.totalItems;
      },
      error: () => {},
    });
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.size = e.pageSize;
    this.page = e.pageIndex;
    this.getHistory();
  }

  onHistoryItemClick(url: string): void {
    this.historyItemClicked = true;
    this.getProgress(url);
  }

  getProgress(url: string) {
    this.service.get(`${Constants.BASE_URL}/${url}`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.progress = response.data.progress;
      },
      error: () => {},
    });
  }
}
