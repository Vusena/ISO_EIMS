import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  specificName:any;
  showResultDetails:boolean=false;
  selectedMembers: string[] = [];
  options: string[] = ['Chairperson', 'Appointing Officer', 'Member '];
  selectedOption = this.options[0];;

  status_code: number;
  errorMessage: string;
  loggedInUser: any;
  loggedInUsername:any;


  constructor(private httpService: HttpService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getLoggedInUser()
    }

  onSubmit(event: any): void {
    event.preventDefault();
    const body = { staffNo: this.searchText };
    this.httpService.postData(`${ApiEndPoints.GROUP_CONFLICTS_SEARCH}`, body,)
      .subscribe({
        next: (res) => {
          // console.log("Response", res)
          this.krastafflist = res.body.data;
          console.log('krastafflist', this.krastafflist);
          this.showResultDetails = true; // Set the flag to true
          // console.log('name', this.krastafflist.name)
          // console.log(res.status)
          this.status_code = res.status;
          // // console.log('status code ', this.status_code);

          if (this.status_code === 200) {
          this.errorMessage = "";
          this.specificName = this.krastafflist.name;
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

  addMember():void{
    if (this.specificName) {
      this.selectedMembers.push(this.specificName);
      this.specificName = ''; // Reset the specific name
      this.showResultDetails = false; // Reset the flag
    }
  }
  getLoggedInUser() {
    this.loggedInUser = this.authService.getLoggedInUser();
    if (this.loggedInUser) {
    // console.log(this.loggedInUser)
    this.loggedInUsername=this.loggedInUser.data.name
    // console.log(this.loggedInUsername)
    } else {
    // No user is logged in
    }
    }
  
  removeMember(member: any) {
    const index = this.selectedMembers.indexOf(member);
    if (index !== -1) {
      this.selectedMembers.splice(index, 1);
    }
  }
}
