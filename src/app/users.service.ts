import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {IUsersData} from './data/schema/userData';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// contains service of user data API
export class UsersService {

  // API data
  private baseUrl: string = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  // user data API call
  getUserDataList(): Observable<IUsersData> {
    return this.http.get<IUsersData>(`${this.baseUrl}`).pipe(retry(1), catchError(this.handleError));
  }

  // common error handling for one service class. For multiple services HttpInterceptor would be right choice.
  handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
