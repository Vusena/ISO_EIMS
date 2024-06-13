import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiEndPoints } from 'app/core/common/ApiEndPoints';
import { HttpService } from 'app/core/services/http.service';

@Component({
  selector: 'app-group-conflict',
  templateUrl: './group-conflict.component.html',
  styleUrls: ['./group-conflict.component.scss']
})
export class GroupConflictComponent implements OnInit {

  searchText: string = '';
  krastafflist: any;
  specificName:any;
  showResultDetails:boolean=false;
  selectedMembers: string[] = [];
  options: string[] = ['Chairperson', 'Appointing Officer', 'Member '];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
      
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
          // this.status_code = res.status;
          // // console.log('status code ', this.status_code);

          // if (this.status_code === 200) {
          //   this.errorMessage = "";
          //   // this.cd.detectChanges();
            this.specificName = this.krastafflist.name;
          //   this.department = this.krastafflist.department;
          //   this.region = this.krastafflist.region;
          //   this.staff_number = this.krastafflist.staffNo;

          // } 
        },
        error: (err) => {
          // console.log('This is the status code', err.status);
          // console.log(err);
          // this.status_code = err.errror.code
          if (err.status === 400 && err.error.data) {
          // this.errorMessage = err.error.description;
          // this.specificName = err.error.data.name;
          // this.department = err.error.data.department;
          // this.region = err.error.data.region;
          // this.staff_number = err.error.data.staffNo;
          // this.errorMessage = err.error.description;
          // this.errorMessage="Data not found. Please contact EIMS administrator on Ext 2825/ 2315 or email: eims@kra.go.ke"
          // this.alertMessage = "";
          } 
          else {
          // this.specificName = "";
          // this.department = "";
          // this.region = "";
          // this.staff_number = "";
          // this.errorMessage = err.error.description;
          // this.errorMessage="Data not found. Please contact EIMS administrator on Ext 2825/ 2315 or email: eims@kra.go.ke"
          // this.alertMessage = "";
          }
      }
      })
  }
  toggleTextVisibility(): void {
    this.specificName = '';
  }
  addMember():void{
    if (this.specificName) {
      this.selectedMembers.push(this.specificName);
      this.specificName = ''; // Reset the specific name
      this.showResultDetails = false; // Reset the flag
    }
  }
}
