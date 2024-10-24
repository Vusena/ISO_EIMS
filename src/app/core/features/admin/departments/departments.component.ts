import { Component } from '@angular/core';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [NgbModalModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent {

  constructor(public activeModal: NgbActiveModal) {}
  
  closeModal() {
    this.activeModal.close(); 
  }
}
