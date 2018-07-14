import { Injectable, NgModule} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';

//PROVIDERS
import { AppSettingsProvider } from '../providers/app-settings/app-settings';
@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
    private apiURL: string = '';
    
    constructor(private loadingController: LoadingController, private appSettingsProvider: AppSettingsProvider) {
        console.log('Hello HttpInterceptorProvider Provider');
        this.apiURL = this.appSettingsProvider.getApiURL();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        //loading controller
	    const loading = this.loadingController.create();
        loading.present();
        
        //Append apiURL
        const dupReq = req.clone({ url: this.apiURL + req.url });

        return next.handle(dupReq).map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                
                //stop loader
                loading.dismiss();
                return event
              }
        });
    }
};

@NgModule({
 providers: [
 { provide: HTTP_INTERCEPTORS, useClass: HttpsRequestInterceptor, multi: true }
 ]
})
export class InterceptorModule { }