import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CheckUserResponseData, SubmitFormResponseData } from '../../shared';
import { Observable } from 'rxjs';
import { ApiDataModel } from './api-data.model';
import { Logger } from '../utils/client-logger';

@Injectable()
export class UsersService extends Logger {

  constructor(private http: HttpClient) {
    super('UsersService')
  }

  checkUsername(username: string): Observable<CheckUserResponseData> {
    this.log(`checking username ${ username }`);
    const url: string = '/api/checkUsername';
    return this.http.post<CheckUserResponseData>(url, { username });
  }

  createUsers(data: ApiDataModel[]): Observable<SubmitFormResponseData> {
    this.log(`creating users ${ JSON.stringify(data) }`);
    const url: string = '/api/submitForm';
    return this.http.post<SubmitFormResponseData>(url, data);
  }
}
