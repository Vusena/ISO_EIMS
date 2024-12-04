import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'app/core/services/http.service';
import { HttpsService } from 'app/core/services/https.service';
import { Constants } from 'app/core/utils/constants';

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
    MatButtonModule
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})

export class DepartmentComponent implements OnInit {
  activeModal = inject(NgbActiveModal);

  @Input() item: any;

  formGroup: FormGroup;

  isLoading = false

  searchText: string = '';

  alert = {
    type: "success",
    isOpen: false,
    title: 'Hurray!',
    message: ""
  }

  constructor(
    private service: HttpsService,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit() {
    this.formGroup = new FormGroup({
      code: new FormControl({ value: this.item.code , disabled: true }),
      name: new FormControl(this.item.name, Validators.required),
      hod: new FormControl(this.item.hod, Validators.required),
      acting_hod: new FormControl(this.item.acting_hod),
    })
  }

  close(flag: boolean) {
    this.activeModal.close(flag);
  }




  onSearch(event: any): void {
    event.preventDefault();
    const data = { staffNo: this.searchText };
    this.service.post(`${Constants.BASE_URL}/coi-group/search`, data).subscribe({
      next: (response: any) => {
        let staff = response.data;
        //this.showSearchResults = true;
        //this.staffName = staff.name;
        //this.staffNo = staff.staffNo;
      },
      error: (error) => {
        this.alert.message = error.message;
        this.alert.title = "Oops!";
        this.alert.type = "danger";

        this.alert.isOpen = true;
      }
    })
  }

  onCloseAlert(): void {
    this.alert.isOpen = false;
  }



  submit() {
    this.isLoading = true;
    const formValues = this.formGroup.getRawValue();
    const data = {
      code: formValues.code,
      name: formValues.name,
      hod: formValues.hod,
      acting_hod: formValues.acting_hod
    };

    this.service.post(`${Constants.BASE_URL}/departments`, data).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.isLoading = false;
          
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
