import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEndPoints} from '../common/ApiEndPoints'
// import {Environment} from '../environments/environment'
import {environment} from 'environments/environment.prod'

import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
import { Enums } from '../common/Enum';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = environment.BASE_URL;
  public redirectUrl = "/dashboard";


  constructor(private http: HttpClient) { }  
  
  login(username: string, password: string): Observable<any> {
    const bodyData = {
      username: username,
      password: password,
    }; 
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    return this.http.post<any>(`${this.apiUrl}${ApiEndPoints.SIGNIN}`, bodyData, {
      headers: headers,
      observe: 'response'
    }).pipe(
      map(response => {
        const token = response.body.token;  

        // this.getUserDetails(token).subscribe();  
        sessionStorage.setItem(Enums.USER, JSON.stringify(response.body));
        sessionStorage.setItem(Enums.TOKEN, token);
        sessionStorage.setItem(Enums.ROLES, JSON.stringify(response.body.data.roles));
        
        return response;
      }),
      catchError(error => {
        throw error;
      })
    );
  }
  

  logout() {
    sessionStorage.removeItem(Enums.TOKEN);
    sessionStorage.removeItem(Enums.USER);
    sessionStorage.clear();
     }

  isLoggedIn() {
    let token = sessionStorage.getItem(Enums.TOKEN)
    //return token !== null;
    return !(token === null)
  }


  getLoggedInUser() : any {
    let item = sessionStorage.getItem(Enums.USER)
    if (item != null) {
      return JSON.parse(item)
    } else {
      return null
    }
  }

  getUserRoles(): any[] {
    let roles = sessionStorage.getItem(Enums.ROLES);
  
    if (roles != null) {
      try {
        //Here we are deserializing my data to the original form which was an array of strings using the json.parse method
        const parsedRoles = JSON.parse(roles);          
        // Directly return the roles array if it's an array of strings
        return parsedRoles;
      } catch (error) {
        return [];
      }
    } else {
    
      return [];
    }
  }


  getUserDetails(token: string): Observable<any> {   
 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });    
  
    return this.http.get<any>(`${this.apiUrl}${ApiEndPoints.PROFILE}`, {
      headers: headers,
      observe: 'response'
    }).pipe(
      map(response => {
      
        sessionStorage.setItem(Enums.USER, JSON.stringify(response.body));
        return response;
      }),
      catchError(error => {
        throw error;
      })
    );
  }
  
  

  // retrieve the authorization token stored in the session storage
    getAuthorizationToken() : String {
      return sessionStorage.getItem(Enums.TOKEN) ?? "";
    }

    private handleError(error: HttpErrorResponse) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        errorMessage = error.error.description;
      }
      return throwError(() => new Error(errorMessage));
    }
  }

