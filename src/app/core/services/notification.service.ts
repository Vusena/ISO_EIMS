import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Adjust the path as necessary
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { ApiEndPoints } from '../common/ApiEndPoints';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  private notificationsSubject = new BehaviorSubject<any[]>([]);   // It holds the latest notification data and emits values to all subscribers.
  notifications$ = this.notificationsSubject.asObservable(); // Observable to subscribe to
  // Components subscribing to notifications$ will receive the current list of notifications, even if they subscribe after the notifications have been fetched.

  constructor(private httpService: HttpService) {}

  // getNotifications(): Observable<any> {
  //   return this.httpService.get(ApiEndPoints.GET_NOTIFICATIONS)
  //     .pipe(
  //       map(response => response),
  //       catchError(error => {
  //         console.error('Error fetching notifications:', error);
  //         throw error; 
  //       })
  //     );
  // }
  
  getNotifications(): void {
    this.httpService.get(ApiEndPoints.GET_NOTIFICATIONS)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching notifications:', error);
          throw error; 
        })
      )
      .subscribe({
        next: (notifications) => {
          this.notificationsSubject.next(notifications); // Update the BehaviorSubject
        },
        error: (error) => {
          console.error('Error updating notifications:', error);
        }
      });
  }

}