import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {

  constructor ( private modalService: NgbModal){}

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true,});
    
  }
  onCloseClick() {
    this.modalService.dismissAll('Close click');
    location.reload();
  }
  onNoConflictClick(nocontent: TemplateRef<any>):void{
    this.modalService.dismissAll();
    this.modalService.open(nocontent, { centered: true,})
   
  }
  onConflictClick(yescontent: TemplateRef<any>):void{
    this.modalService.dismissAll();
    this.modalService.open(yescontent, { centered: true,})
  }
}
