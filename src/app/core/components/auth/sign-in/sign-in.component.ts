import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { AuthService } from 'app/core/services/auth.service';
import { Observable, catchError } from 'rxjs';
import * as CryptoJS from 'crypto-js';



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
  
  encrypt(param: string): string {
    // Secret key
    const secretKey = CryptoJS.enc.Utf8.parse(environment.SECRETKEY);
    // Initialization vector
    const iv = CryptoJS.lib.WordArray.random(128/8);
    // Data to encrypt
    const data = CryptoJS.enc.Utf8.parse(param);
    // Encrypt with AES, CBC mode, and PKCS7 padding
    const encrypted = CryptoJS.AES.encrypt(data, secretKey, {
      iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
    });
    // Encrypted data in string format
    return CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
}

  onSubmit() {
    this.isLoading = true;  
    const username = this.Form.value.username;
    const password = this.Form.value.password;    
    const encryptedPassword = this.encrypt(password);   

    this.authService.login(username, encryptedPassword).subscribe({
      next: (response) => {
       
        this.isLoading = false;
        this.successMessage = "Logging you in, please wait...";     
    
        const roles = response.body.data.roles.map((role: any) => role.name);
        if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.description;
        // console.error("An error was encountered. Below is the Error:", error);
      },
      complete: () => {
      }
    });
    
  }

  }
 


