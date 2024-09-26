import {Component, inject, Inject, Input, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {DatePipe, NgForOf} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {MatOptionModule} from "@angular/material/core";

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    DatePipe,
    MatListModule,
    MatOptionModule,
    NgForOf,
   
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PreviewComponent {
  
  activeModal = inject(NgbActiveModal);

	@Input() data: any;
  
  close(flag: boolean) {
    this.activeModal.close(flag);
  }
  
  
}
