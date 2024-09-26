import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  httpHeaders: HttpHeaders;
  formDataHeaders: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' +
        + this.authService.getAuthorizationToken()
    })

    this.formDataHeaders = new HttpHeaders({
      'Content-Type': 'multipart/form-data', // Note: Setting this manually is typically not necessary
      'Authorization': `Bearer ${this.authService.getAuthorizationToken()}`
    });
  }

  postData(url: string, body: {}): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getAuthorizationToken()}`);
    return this.http.post(environment.BASE_URL + url, body, { headers, observe: "response", })
  }

  // GET
  get(url: string, params?: { [key: string]: string }): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getAuthorizationToken()}`);
    return this.http.get(environment.BASE_URL + url, { headers })
  }

  // GET BY ID
  getById(Id: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getAuthorizationToken()}`);
    return this.http.get(`${environment.BASE_URL}${Id}`, { headers });
  }

  // SEARCH BY NAME OR PHONE NO
  getSearchedUser(url: string, search?: { [key: string]: string }): Observable<any> {
    let queryParams: HttpParams;
    if (search) {
      queryParams = new HttpParams().set(search.key, search.value);
    } else {
      queryParams = new HttpParams();
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getAuthorizationToken()}`);
    return this.http.get(environment.BASE_URL + url, { headers, params: queryParams });
  }

  //  GET PAGINATED API
  getAllnominees(url: string, params?: { [key: string]: string }, pageNumber?: number, pageSize?: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getAuthorizationToken()}`);
    let queryParams = {};
    if (params) {
      queryParams = { ...params };
    }
    if (pageNumber !== undefined && pageSize !== undefined) {
      queryParams['page'] = pageNumber;
      queryParams['size'] = pageSize;
    }
    return this.http.get(environment.BASE_URL + url, { headers, params: queryParams });
  }

  update(url: string, updatedData: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getAuthorizationToken()}`);
    return this.http.put(environment.BASE_URL + url, updatedData, { headers, observe: "response", })
  }
}
