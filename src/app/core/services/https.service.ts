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

  constructor(private http: HttpClient, authService: AuthService) {
    if (authService.isLoggedIn()) {
      this.headers = new HttpHeaders({
        'Authorization': 'Bearer ' + authService.getAuthorizationToken()
      });
    } else {
      this.headers = new HttpHeaders();
    }
  }

  get(url: string, params: HttpParams) : Observable<any> {
    return this.http.get<any>(url, { headers: this.headers, params: params }).pipe(
      catchError(this.handleError)
    )
  }

  post(url: string, body: any) : Observable<any> {
    return this.http.post<any>(
      url, body, { headers: this.headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /*put(url: string, body: any) : Observable<any> {
    return this.http.put<any>(
      url, body, { headers: this.headers }
    ).pipe(
      catchError(this.handleError)
    );
  }*/

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
