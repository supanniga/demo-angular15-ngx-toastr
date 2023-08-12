import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActiveToast, GlobalConfig, IndividualConfig, ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { SystemResponse } from './app.service';
import { ResponseStatusService } from './response-status.service';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  config: IndividualConfig = {
    /**
     * disable both timeOut and extendedTimeOut
     * default: false
     */
    disableTimeOut: true,
    /**
     * toast time to live in milliseconds
     * default: 5000
     */
    timeOut: 5000,
    /**
     * toast show close button
     * default: false
     */
    closeButton: true,
    /**
     * time to close after a user hovers over toast
     * default: 1000
     */
    extendedTimeOut: 1000,
    /**
     * show toast progress bar
     * default: false
     */
    progressBar: false,
    /**
     * changes toast progress bar animation
     * default: decreasing
     */
    progressAnimation: 'decreasing',
    /**
     * render html in toast message (possibly unsafe)
     * default: false
     */
    enableHtml: false,
    /**
     * css class on toast component
     * default: ngx-toastr
     */
    toastClass: 'ngx-toastr',
    /**
     * css class on toast container
     * default: toast-top-right
     */
    positionClass: 'toast-top-right',
    /**
     * css class on toast title
     * default: toast-title
     */
    titleClass: 'toast-title',
    /**
     * css class on toast message
     * default: toast-message
     */
    messageClass: 'toast-message',
    /**
     * animation easing on toast
     * default: ease-in
     */
    easing: 'ease-in',
    /**
     * animation ease time on toast
     * default: 300
     */
    easeTime: 300,
    /**
     * clicking on toast dismisses it
     * default: true
     */
    tapToDismiss: true,
    /**
     * Angular toast component to be shown
     * default: Toast
     */
    // toastComponent?: ComponentType<any>;
    /**
     * Helps show toast from a websocket or from event outside Angular
     * default: false
     */
    onActivateTick: false,
    /**
     * New toast placement
     * default: true
     */
    newestOnTop: true,
    /**
     * Payload to pass to the toast component
     */
    // payload?: ConfigPayload;
  };


  toastrConfig: GlobalConfig = this.toastr.toastrConfig;
  currentlyActive: number = this.toastr.currentlyActive;
  toasts: ActiveToast<any>[] = this.toastr.toasts;
  overlayContainer?: ToastContainerDirective = this.toastr.overlayContainer;
  previousToastMessage: string | undefined = this.toastr.previousToastMessage;

  constructor(
    private toastr: ToastrService,
    private responseStatus: ResponseStatusService,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  show<ConfigPayload = any>(message?: string, title?: string, override?: Partial<IndividualConfig<ConfigPayload>>, type?: string): ActiveToast<any> {
    const config = override ? override : { ...this.config };
    return this.toastr.show(message, title, config, type);
  }

  success<ConfigPayload = any>(message?: string, title?: string, override?: Partial<IndividualConfig<ConfigPayload>>): ActiveToast<any> {
    const config = override ? override : { ...this.config };
    return this.toastr.success(message, title, config);
  }

  error<ConfigPayload = any>(message?: string, title?: string, override?: Partial<IndividualConfig<ConfigPayload>>): ActiveToast<any> {
    const config = override ? override : { ...this.config };
    return this.toastr.error(message, title, config);
  }

  info<ConfigPayload = any>(message?: string, title?: string, override?: Partial<IndividualConfig<ConfigPayload>>): ActiveToast<any> {
    const config = override ? override : { ...this.config };
    return this.toastr.info(message, title, config);
  }

  warning<ConfigPayload = any>(message?: string, title?: string, override?: Partial<IndividualConfig<ConfigPayload>>): ActiveToast<any> {
    const config = override ? override : { ...this.config };
    return this.toastr.warning(message, title, config);
  }

  clear(toastId?: number): void {
    this.toastr.clear(toastId);
  }

  remove(toastId: number): boolean {
    return this.toastr.remove(toastId);
  }

  findDuplicate(title: string, message: string, resetOnDuplicate: boolean, countDuplicates: boolean): ActiveToast<any> {
    return this.toastr.findDuplicate(title, message, resetOnDuplicate, countDuplicates);
  }

  showResponseMessage(response: SystemResponse<any>) {
    let config = { ...this.config };
    const message = this.responseStatus.getMessage(response);
    this.show(message, '', config);
  }

  successResponseMessage(response: SystemResponse<any>) {
    let config = { ...this.config };
    const message = this.responseStatus.getMessage(response);
    this.success(message, '', config);
  }

  errorResponseMessage(response: SystemResponse<any>) {
    let config = { ...this.config };
    const message = this.responseStatus.getMessage(response);
    this.error(message, '', config);
  }

  warningResponseMessage(response: SystemResponse<any>) {
    let config = { ...this.config };
    const message = this.responseStatus.getMessage(response);
    this.warning(message, '', config);
  }

  infoResponseMessage(response: SystemResponse<any>) {
    let config = { ...this.config };
    const message = this.responseStatus.getMessage(response);
    this.info(message, '', config);
  }

  showResponse(res: SystemResponse<any>, svgContent: string) {
    let config = { ...this.config };
    const message = this.responseStatus.getMessage(res);
    switch (res.responseStatus.type) {
      case 'SUCCESS': {
        this.toastr.success(message, '', config);
        this.changeToastBackgroundImage(res, svgContent);
        this.changeToastCloseButton();
        break;
      }
      case 'WARNING': {
        this.toastr.warning(message, '', config);
        this.changeToastBackgroundImage(res, svgContent);
        this.changeToastCloseButton();
        break;
      }
      case 'FAILED': {
        this.toastr.error(message, '', config);
        this.changeToastBackgroundImage(res, svgContent);
        this.changeToastCloseButton();
        break;
      }
      default: {
      }
    }
  }

  changeToastBackgroundImage(res: SystemResponse<any>, svgContent: string) {
    const svgColor = res.responseStatus.svgColor;
    const root = `--toast-${res.responseStatus.type}-background-image`;
    const svgContentNewColor = this.replaceSvgColor(svgContent, svgColor);
    const backgroundImageUrl = this.getBackgroundImageUrl(svgContentNewColor);
    this.document.getElementById('toast-container')?.style.setProperty(root, backgroundImageUrl);
  }

  changeToastCloseButton() {
    setTimeout(() => {
      const collection: HTMLCollectionOf<Element> = this.document.getElementsByClassName('toast-close-button');
      const button: Element | null = collection.item(0);
      if (button) {
        const children: HTMLCollection = button.children;
        if (children) {
          const span = children.item(0);
          if (span) {
            // toastCloseButtonElement.classList.remove('toast-close-button');
            button.removeChild(span);
            button.classList.add('btn');
            button.classList.add('toast-close-button2');
            const iconString = '<i class="bi bi-x-circle-fill"></i>';
            const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path opacity="0.4" d="M24.5 12C24.5 18.6274 19.1274 24 12.5 24C5.87258 24 0.5 18.6274 0.5 12C0.5 5.37258 5.87258 0 12.5 0C19.1274 0 24.5 5.37258 24.5 12ZM8.53033 6.96967C8.23744 6.67678 7.76256 6.67678 7.46967 6.96967C7.17678 7.26256 7.17678 7.73744 7.46967 8.03033L11.4393 12L7.46967 15.9697C7.17678 16.2626 7.17678 16.7374 7.46967 17.0303C7.76256 17.3232 8.23744 17.3232 8.53033 17.0303L12.5 13.0607L16.4697 17.0303C16.7626 17.3232 17.2374 17.3232 17.5303 17.0303C17.8232 16.7374 17.8232 16.2626 17.5303 15.9697L13.5607 12L17.5303 8.03033C17.8232 7.73744 17.8232 7.26256 17.5303 6.96967C17.2374 6.67678 16.7626 6.67678 16.4697 6.96967L12.5 10.9393L8.53033 6.96967Z" fill="white"/>
</svg>
          `;
            button.innerHTML = svgString;
          }
        }
      }
    }, 0)
  }

  replaceSvgColor(svgContent: string, svgColor: string) {
    const originalString = svgContent;
    const searchString = 'currentColor';
    const replacementString = svgColor;
    const modifiedString = originalString.replace(new RegExp(searchString, 'g'), replacementString);
    return modifiedString;
  }

  getBackgroundImageUrl(svgContent: string) {
    const encodedSvg = btoa(svgContent);
    const backgroundImageUrl = `url("data:image/svg+xml;base64,${encodedSvg}")`;
    return backgroundImageUrl;
  }

}
