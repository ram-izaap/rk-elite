import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';



import { InterceptorModule } from '../app/interceptor.module';

import { MyApp } from './app.component';

//PLUGINS
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';

//PROVIDERS
import { UserProvider } from '../providers/user/user';
import { AppSettingsProvider } from '../providers/app-settings/app-settings';
import { GroupProvider } from '../providers/group/group';
import { CallNumber } from '@ionic-native/call-number';

import { ComponentsModule } from '../components/components.module';
//import { DirectivesModule } from '../directives/directives.module';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    InterceptorModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ComponentsModule,
    //DirectivesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //{provide: HTTP_INTERCEPTORS,useClass: HttpInterceptorProvider,multi: true},
    UserProvider,
    AppSettingsProvider,
    GroupProvider,
    Camera,
    FileTransfer,
    FileChooser,
    CallNumber,
    File
  ]
})
export class AppModule {}
