import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],

  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    HttpClientModule,
    MatIconModule
  ],
  exports:[
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})

export class LayoutModule { }
