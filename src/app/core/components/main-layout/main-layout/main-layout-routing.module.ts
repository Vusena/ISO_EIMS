import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentsComponent } from 'app/core/features/admin/departments/departments.component';

import { DashboardComponent } from 'app/core/features/dashboard/dashboard.component';
import { FaqsComponent } from 'app/core/features/faqs/faqs.component';
import { GiftsGivenOutComponent } from 'app/core/features/gifts-given-out/gifts-given-out.component';
import { GiftsReceivedComponent } from 'app/core/features/gifts-received/gifts-received.component';
import { GroupConflictComponent } from 'app/core/features/group-conflict/group-conflict.component';
import { IndividualConflictComponent } from 'app/core/features/individual-conflict/individual-conflict.component';
import { IntergrityAwardComponent } from 'app/core/features/intergrity-award/intergrity-award.component';
import { LogOutComponent } from 'app/core/features/log-out/log-out.component';
import { PoliciesComponent } from 'app/core/features/policies/policies.component';
import { ReportsComponent } from 'app/core/features/reports/reports.component';
import { AuthGuard } from 'app/core/guards/auth-guard';
import { HasRoleGuard } from 'app/core/guards/hasrole-guard';


const mainLayoutRoutes: Routes = [

  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "individual-conflict", component: IndividualConflictComponent, canActivate: [AuthGuard] },
  { path: "group-conflict", component: GroupConflictComponent, canActivate: [AuthGuard] },
  { path: "gifts-received", component: GiftsReceivedComponent, canActivate: [AuthGuard] },
  { path: "gifts-given-out", component: GiftsGivenOutComponent, canActivate: [AuthGuard] },
  {
    path: "intergrity-award", component: IntergrityAwardComponent,
    canActivate: [AuthGuard, HasRoleGuard],
    data: { requiredRole: ['ROLE_ADMIN', 'ROLE_USER']}
  },
  {
    path: "departments", component: DepartmentsComponent,
    canActivate: [AuthGuard, HasRoleGuard],
    data: { requiredRole: ['ROLE_ADMIN',]}
  },
  {
    path: "reports", component: ReportsComponent,
    canActivate: [AuthGuard, HasRoleGuard],
    data: { requiredRole: ['ROLE_ADMIN']}
  },
  { path: "policies", component: PoliciesComponent },
  { path: "faqs", component: FaqsComponent },
  { path: "logout", component: LogOutComponent }

];

@NgModule({
  imports: [
    RouterModule.forChild(mainLayoutRoutes),

  ],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { }
