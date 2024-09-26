import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { SignInComponent } from '../sign-in/sign-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';

const AuthRoutes: Routes = [

  { path:"sign-in", component:SignInComponent},
  { path:"sign-up", component:SignUpComponent}

];

@NgModule({
  imports: [RouterModule.forChild(AuthRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
