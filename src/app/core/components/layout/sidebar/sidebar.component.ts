import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services/auth.service';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: 'dashboard',     title: 'Dashboard',         icon:'dashboard-icon.png',       class: '' },
  { path: 'individual-conflict',         title: 'Individual Conflict',             icon:'individual-conflict-icon.png',    class: '' },
  { path: 'group-conflict',          title: 'Groups Conflict',              icon:'group-conflicts-icon.png',      class: '' },
  { path: 'gifts-received', title: 'Gifts Recieved',     icon:'gift-received-icon.png',    class: '' },
  { path: 'gifts-given-out',          title: 'Gifts Given Out',      icon:'gift-icon.png',  class: '' },
  { path: 'intergrity-award',          title: 'Integrity-Award',      icon:'gift-icon.png',  class: '' },
  // { path: 'reports',          title: 'Reports',      icon:'gift-icon.png',  class: '' },

 

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];


    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

  constructor(private authService:AuthService) { }

 logout() {
  this.authService.logout()
}

  

}



