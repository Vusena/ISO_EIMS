import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Environment } from 'app/core/environments/environment';
import { AuthService } from 'app/core/services/auth.service';
import { Observable, catchError } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  errorMessage: string = "";
  fieldTextType: boolean|undefined;
  Form: FormGroup;
  successMessage!: string;
  isLoading: boolean = false;
  isLoggedIn :boolean = false;

  constructor( private http: HttpClient, private router: Router, private fb: FormBuilder,private authService: AuthService) { }
  

  ngOnInit() {
    this.Form = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }
  
  onSubmit() {
    this.isLoading = true;
  
    
    const username = this.Form.value.username;
    const password = this.Form.value.password;
      //  console.log(username, password)
     this.authService.login(username, password).subscribe(
      (response) => {
        // console.log('Login Response:', response);
        this.isLoading = false;
        this.successMessage = "Logging you in, please wait...";
        localStorage.setItem('TOKEN', response.body.token);
        localStorage.setItem('USER', JSON.stringify(response.body.data.staffNo));
        localStorage.setItem('ROLES', JSON.stringify(response.body.data.roles.map((role: any) => role.name)));
        // console.log(this.authService.getUserRoles());
        // Navigate to dashboard or any other route upon successful login
        // console.log('USER', response.body.data.staffNo)
        // console.log('ROLES', response.body.data.roles)
        // console.log('Roles:', localStorage.getItem('ROLES'));
        // Navigate to dashboard or any other route upon successful login

        const roles = response.body.data.roles.map((role: any) => role.name);
        // console.log(roles)
        if (roles.includes('ADMIN')) {
          // console.log('User is an admin.');
          this.router.navigate(['/dashboard']);
        } else {
          // console.log('User is not an admin.');
          // Assuming 'intergrity-award' is the route for regular users
          this.router.navigate(['/intergrity-award']);
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.description;
        console.error("An error was encountered. Below is the Error:", error);
      }
    );
  }

  }
 


