import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpsService } from 'app/core/services/https.service';
import { Constants } from 'app/core/utils/constants';
import { DepartmentComponent } from './department/department.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})

export class DepartmentsComponent implements OnInit {
  displayedColumns: string[] = ['no', 'code', 'name', 'hod', 'active', 'actions'];
    dataSource = new MatTableDataSource<any>();

  private modalService = inject(NgbModal);
  @ViewChild('content') content: TemplateRef<any>;

  constructor(
    private service: HttpsService,
   
  ){ }

  ngOnInit(): void {
    this.getItems() 
  }

  getItems(): void {
    this.service.get(`${Constants.BASE_URL}/departments`, new HttpParams()).subscribe({
      next: (response: any) => {
        this.dataSource = response.data
      },
      error: () => { },
    })
  }

  onEdit(item: any): void {  
    const modalRef = this.modalService.open(DepartmentComponent, { centered: true });
    modalRef.componentInstance.item = item;
  }
  
  onDelete(element: any): void {
    console.log('Deleting', element);
    // Show a confirmation dialog and delete the row
  }
}