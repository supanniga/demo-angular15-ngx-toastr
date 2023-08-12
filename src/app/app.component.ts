import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppService, SystemResponse } from './app.service';
import { BootstrapIconsService } from './bootstrap-icons.service';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'demo-angular15-ngx-toastr';

  svgContent: string = '';
  isSuccessLoading: boolean = false;
  isWarningLoading: boolean = false;
  isErrorLoading: boolean = false;

  constructor(
    private appService: AppService,
    private toast: ToastService,
    private bootstrapIconsService: BootstrapIconsService,
  ) {
  }

  ngOnInit(): void {
  }

  success() {
    this.isSuccessLoading = true;
    this.appService.getSuccess().subscribe({
      next: (res) => {
        this.isSuccessLoading = false;
        this.showToast(res);
      },
      error: (err: HttpErrorResponse) => {
        this.isWarningLoading = false;
        this.showToast(err.error);
      },
      complete: () => { },
    });
  }

  warning() {
    this.isWarningLoading = true;
    this.appService.getWarning().subscribe({
      next: (res) => {
        this.isWarningLoading = false;
        this.showToast(res);
      },
      error: (err: HttpErrorResponse) => {
        this.isWarningLoading = false;
        this.showToast(err.error);
      },
      complete: () => { },
    });
  }

  error() {
    this.isErrorLoading = true;
    let response: SystemResponse<any>;
    this.appService.getError().subscribe({
      next: (res) => {
        this.isErrorLoading = false;
        this.showToast(res);
      },
      error: (err: HttpErrorResponse) => {
        this.isWarningLoading = false;
        this.showToast(err.error);
      },
      complete: () => { },
    });
  }

  showToast(res: SystemResponse<any>) {
    this.bootstrapIconsService.fetchSvgContent(res.responseStatus.svgName).subscribe({
      next: (svgContent) => {
        this.svgContent = svgContent;
        this.toast.showResponse(res, svgContent);
      },
      error: (err) => {
        console.error('Error fetching SVG content:', err);
      },
      complete: () => {
      },
    });
  }

  clear() {
    this.toast.clear();
  }


  changeIcon(event: Event) {
    console.log(event);
  }

  changeColor(event: Event) {
    console.log(event);
  }
}
