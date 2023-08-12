import { Injectable } from '@angular/core';
import { ResponseStatusMessage, SystemResponse } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseStatusService {

  constructor(
  ) { }

  getCode(response: SystemResponse<any>): string {
    return response.responseStatus.code;
  }

  getType(response: SystemResponse<any>): string {
    return response.responseStatus.type;
  }

  getKey(response: SystemResponse<any>): string {
    return response.responseStatus.key;
  }

  getMessages(response: SystemResponse<any>): ResponseStatusMessage[] {
    return response.responseStatus.messages;
  }

  getMessage(response: SystemResponse<any>): string {
    if (response.responseStatus) {
      const responseStatusMessages = response.responseStatus.messages;
      if (responseStatusMessages.length === 1) {
        return responseStatusMessages[0].message;
      } else {
        const responseStatusMessage = responseStatusMessages.find((message) => message.language === 'EN');
        if (responseStatusMessage) {
          return responseStatusMessage.message;
        } else {
          return responseStatusMessages[0].message;
        }
      }
    } else {
      return 'Unknown Response Message';
    }

  }
}
