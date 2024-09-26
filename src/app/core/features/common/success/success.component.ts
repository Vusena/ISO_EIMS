import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IntergrityAwardComponent } from 'app/core/features/intergrity-award/intergrity-award.component';
import { Input, ElementRef, ViewChild } from '@angular/core';


declare var $: any;


@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})

export class SuccessComponent implements OnInit {

  @Input() show: boolean;

  @ViewChild('customModal') customModal: ElementRef;


constructor(public dialog: MatDialog,private dialogRef: MatDialogRef<IntergrityAwardComponent>){}

 ngOnInit(): void {}
   
 showModal() {
  $(this.customModal.nativeElement).modal('show');
}

hideModal() {
  $(this.customModal.nativeElement).modal('hide');
}
// onClear(): void {
//   this.dialogRef.close(null);
// }



}
