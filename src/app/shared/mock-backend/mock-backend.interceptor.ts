import {HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {delay, Observable, of, tap} from "rxjs";
import {CheckUserResponseData, SubmitFormResponseData} from "../interface/responses";
import { Logger } from '../../users/utils/client-logger';

@Injectable()
export class MockBackendInterceptor extends Logger implements HttpInterceptor {

  constructor() {
    super('MockBackendInterceptor');
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpResponse<CheckUserResponseData | SubmitFormResponseData>> {

    if (req.url.endsWith('/api/checkUsername') && req.method === 'POST') {
      return this.handleCheckUsername(req);
    }
    if (req.url.endsWith('/api/submitForm') && req.method === 'POST') {
      return this.handleSubmitForm();
    }

    return of(new HttpResponse({ status: 404, body: { result: 'You are using the wrong endpoint'} }));
  }

  private handleCheckUsername(req: HttpRequest<any>): Observable<HttpResponse<CheckUserResponseData>> {
    this.log(req.body.username)
    const isAvailable = req.body.username.includes('new');
    const response = new HttpResponse({ status: 200, body: { isAvailable } });

    return of(response).pipe(
      delay(500),
      tap(() => this.log(`checkUsername response: ${ JSON.stringify({ isAvailable })}`))
    );
  }

  private handleSubmitForm(): Observable<HttpResponse<SubmitFormResponseData>> {
    const response = new HttpResponse({ status: 200, body: { result: 'nice job' } });

    return of(response).pipe(
      delay(500),
      tap(() => this.log('submitForm response'))
    );
  }
}
