import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationService } from 'app/core/services/notification.service';
import { AuthService } from 'app/core/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentsComponent } from 'app/core/features/admin/departments/departments.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  notifications: any[] = []
  notificationCount: number = 0;
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  user: any;
  supName:any = "";
  supStaffNo:any = "";
  department:any = "";
  isAdmin:any;

  public isCollapsed = true;
  @ViewChild("app-navbar", { static: false }) button;

  constructor(
    location: Location,
    private renderer: Renderer2,
    private element: ElementRef,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    
  ) 
    {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }


  ngOnInit() {
    this.getUser();
    this.getNotifications();
   
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });
  }

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    html.classList.add('nav-open');
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }
    this.sidebarVisible = true;
  };

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    if (window.innerWidth < 991) {
      setTimeout(function () {
        mainPanel.style.position = '';
      }, 500);
    }
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };

  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    // console.log(navbar);
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }
  }

  getNotifications() {
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notificationCount = notifications.length;
    });
  }
  getUser(): void {
    this.user = this.authService.getLoggedInUser();
 
  if (this.user.data.supervisor != null) {
    this.supName = this.user.data.supervisor.name;
    this.supStaffNo = this.user.data.supervisor.staffNo;
  }
  else if (this.user.data.department != null) {
    this.department = this.user.data.department;
  }
  }

  logout() {
    this.authService.logout()
  }
  openDepartmentsModal() {
    const modalRef = this.modalService.open(DepartmentsComponent, {
      ariaLabelledBy: 'modal-basic-title'
    });
}


}