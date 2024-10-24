import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class HttpsService {

  headers: HttpHeaders;
  
  // constructor(private http: HttpClient, authService: AuthService) {
  //   if (authService.isLoggedIn()) {
  //     this.headers = new HttpHeaders({
  //       'Authorization': 'Bearer ' + authService.getAuthorizationToken()
  //     });
  //   } else {
  //     this.headers = new HttpHeaders();
  //  }
  // }

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Dynamically get the Authorization header for each request
private getHeaders(): HttpHeaders {
  let headers = new HttpHeaders();
  if (this.authService.isLoggedIn()) {
    const token = this.authService.getAuthorizationToken();
    headers = headers.set('Authorization', 'Bearer ' + token);
  }
  return headers;
}

  get(url: string, params: HttpParams): Observable<any> {
    return this.http.get<any>(url, { headers: this.getHeaders(), params: params }).pipe(
      catchError(this.handleError)
    );
  }

  post(url: string, body: any) : Observable<any> {
    return this.http.post<any>(
      url, body, { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  put(url: string, body: any) : Observable<any> {
    return this.http.put<any>(
      url, body, { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
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
