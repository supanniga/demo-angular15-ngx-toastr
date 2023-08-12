import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

export interface ResponseStatusMessage {
  language: string;
  message: string;
}

export interface ResponseStatus {
  code: string;
  type: 'SUCCESS' | 'FAILED' | 'WARNING';
  key: string;
  messages: ResponseStatusMessage[];
  svgName: string;
  svgColor: string;
}

export interface SystemResponse<T> {
  responseStatus: ResponseStatus;
  responseData: T;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  successResponse: SystemResponse<null> = {
    responseStatus: {
      code: "USS000009",
      type: "SUCCESS",
      key: "SUCCESS",
      messages: [
        {
          language: "EN",
          message: "Success"
        },
        {
          language: "TH",
          message: "Success"
        }
      ],
      svgName: 'check-circle-fill',
      svgColor: '#5DD32A',
    },
    responseData: null
  };

  warningResponse: SystemResponse<null> = {
    responseStatus: {
      code: "USS000009",
      type: "WARNING",
      key: "WARNING",
      messages: [
        {
          language: "EN",
          message: "Warning"
        },
        {
          language: "TH",
          message: "Warning"
        }
      ],
      svgName: 'exclamation-triangle-fill',
      svgColor: '#090D1D',
    },
    responseData: null
  };

  errorResponse: SystemResponse<null> = {
    responseStatus: {
      code: "USS000009",
      type: "FAILED",
      key: "FAILED",
      messages: [
        {
          language: "EN",
          message: "Failed"
        },
        {
          language: "TH",
          message: "Failed"
        }
      ],
      svgName: 'exclamation-octagon-fill',
      svgColor: '#FFFFFF',
    },
    responseData: null
  };

  getSuccess(): Observable<SystemResponse<null>> {
    return of(this.successResponse).pipe(delay(1000));
  }

  getWarning(): Observable<SystemResponse<null>> {
    return of(this.warningResponse).pipe(delay(1000));
  }

  getError(): Observable<SystemResponse<null>> {
    return of(this.errorResponse).pipe(delay(1000));
  }

}
