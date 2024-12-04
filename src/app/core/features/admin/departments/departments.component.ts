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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

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
  displayedColumns: string[] = ['no', 'code', 'name', 'hod', 'acting_hod', 'active', 'actions'];
    dataSource = new MatTableDataSource<any>();

  private modalService = inject(NgbModal);
  @ViewChild('content') content: TemplateRef<any>;

  constructor(
    private service: HttpsService,
    private matIconRegistry: MatIconRegistry, 
    private domSanitizer: DomSanitizer
  ){ }

  ngOnInit(): void {
    this.getItems()

    this.matIconRegistry.addSvgIcon(
      'edit', // Name of the icon
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/outline-edit.svg') // Path to the SVG file
    );

    this.matIconRegistry.addSvgIcon(
      'trash', // Name of the icon
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/outline-trash.svg') // Path to the SVG file
    );
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