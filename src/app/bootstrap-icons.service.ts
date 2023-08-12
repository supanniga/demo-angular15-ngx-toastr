import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BootstrapIconsService {

  constructor(private http: HttpClient) {
  }

  fetchSvgContent(svgName: string): Observable<string> {
    const svgFilePath = `assets/icons/${svgName}.svg`;

    return this.http.get(svgFilePath, { responseType: 'text' });
  }
}
