import { CommonModule } from '@angular/common';
import { Component, inject, input, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'app/core/services/http.service';
import { HttpsService } from 'app/core/services/https.service';
import { Constants } from 'app/core/utils/constants';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class DepartmentComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() item: any;

  searchForm: FormGroup;
  isLoading = false;
  searchText: string = '';
  searchResults: any[] = [];
  showSearchResults = false;
  staffDetails: any;
  staffName: string;
  staffNo: any;
  HODResults:boolean=false;

  alert = {
    type: "success",
    isOpen: false,
    title: 'Hurray!',
    message: ""
  }

  constructor(
    private service: HttpsService  
  ) { }


  ngOnInit() {
   console.log(this.item)
  }

  close(flag: boolean) {
    this.activeModal.close(flag);
  }

  onSearch(event: any): void {
    event.preventDefault();
    const data = { staffNo: this.searchText };
    this.service.post(`${Constants.BASE_URL}/coi-group/search`, data).subscribe({
      next: (response: any) => {
        this.staffDetails = response.data;
        this.showSearchResults = true;
        this.staffName = this.staffDetails.name;
        this.staffNo=this.staffDetails.staffNo;
        this.alert.isOpen = false;
      },
      error: (error) => {
        console.log(error)
        this.alert.isOpen = true;
        this.alert.message = error.message;
        this.alert.title = "Oops!";
        this.alert.type = "danger";
      }
    })
  }

  addHOD(): void {
    this.staffNo = this.staffDetails.staffNo;
    this.showSearchResults=false;
    this.HODResults=true;    
  }
  toggleSearch():void{
    this.HODResults=false;
  }

  onCloseAlert(): void {
    this.alert.isOpen = false;
  }

  onSubmit() {
    this.isLoading = true;  
    let hod=this.staffDetails.staffNo;
    
    console.log('hodStaffNo', hod)
    const data={
      name:this.item.name,
      hod: this.staffDetails.staffNo,
      acting_hod:this.item.acting_hod
    }  
 console.log('data', data)
    this.service.post(`${Constants.BASE_URL}/departments`, data).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.isLoading = false;
          this.addHOD()
        }
      },
      complete() {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.alert.message = error.message;
        this.alert.title = "Oops!";
        this.alert.type = "danger";
        this.alert.isOpen = true;
      },
    });
  }

  cancel() {
    this.activeModal.close(true);
  }
}
