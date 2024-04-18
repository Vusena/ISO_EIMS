import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { LayoutModule } from '../../layout/layout.module';


import { GiftsGivenOutComponent } from 'app/core/features/gifts-given-out/gifts-given-out.component';
import { GiftsReceivedComponent } from 'app/core/features/gifts-received/gifts-received.component';
import { GroupConflictComponent } from 'app/core/features/group-conflict/group-conflict.component';
import { IndividualConflictComponent } from 'app/core/features/individual-conflict/individual-conflict.component';
import { DashboardComponent } from 'app/core/features/dashboard/dashboard.component';
import { PoliciesComponent } from 'app/core/features/policies/policies.component';
import { FaqsComponent } from 'app/core/features/faqs/faqs.component';
import { LogOutComponent } from 'app/core/features/log-out/log-out.component';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {MatSliderModule} from '@angular/material/slider';
import { IntergrityAwardComponent } from 'app/core/features/intergrity-award/intergrity-award.component';
import { ReportsComponent } from 'app/core/features/reports/reports.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import {MatTabsModule} from '@angular/material/tabs';
import { TabsComponent } from 'app/core/features/admin/tabs/tabs.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { IntergrityAwardAdminComponent } from 'app/core/features/admin/intergrity-award-admin/intergrity-award-admin.component';

import { SuccessComponent } from 'app/core/features/common/success/success.component';
import { AdminDashboardComponent } from 'app/core/features/admin/admin-dashboard/admin-dashboard.component';
import { userInfo } from 'os';
import { UserDashboardComponent } from 'app/core/features/user/user-dashboard/user-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';









@NgModule({
  declarations: [
      DashboardComponent,
      IndividualConflictComponent,
      GroupConflictComponent,
      GiftsReceivedComponent,
      GiftsGivenOutComponent,
      PoliciesComponent,
      FaqsComponent,
      LogOutComponent,
      IntergrityAwardComponent,
      ReportsComponent,
      TabsComponent,
      IntergrityAwardAdminComponent,
      SuccessComponent,
      AdminDashboardComponent,
      UserDashboardComponent,
  
    

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
  imports: [
    CommonModule,
    MainLayoutRoutingModule,
    LayoutModule,
    ReactiveFormsModule,
    FormsModule,

    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSliderModule,
    MatDialogModule,
    MatNativeDateModule,
    FullCalendarModule,
    MatTabsModule,

    MatTableModule,
    MatPaginatorModule,
    NgbModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class MainLayoutModule { }
