import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
import { HttpService } from 'app/core/services/http.service';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {


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

  constructor(private httpService: HttpService) {

  }

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


//   togglePrivilegeSelection(privilege): any[]{
//    console.log(this.privileges)
//        const privilegeIndex = this.privileges.indexOf(privilege.id);
//     console.log('privilegeIndex', privilegeIndex)
//     if (privilegeIndex === -1 ) {
//                this.privileges.push(privilege.id);
//         console.log('privileges', this.privileges)
//     } 
//     else {
//         this.privileges.splice(privilegeIndex, 1);
//         console.log('slice privileges', this.privileges)
//     }
//     return this.privileges;
// }


}

