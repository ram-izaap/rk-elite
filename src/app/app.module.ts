import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
//import { LocationTracker } from '../providers/location-tracker';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';


import { InterceptorModule } from '../app/interceptor.module';

import { MyApp } from './app.component';

//PLUGINS
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FCM } from '@ionic-native/fcm';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';

//PROVIDERS
import { UserProvider } from '../providers/user/user';
import { AppSettingsProvider } from '../providers/app-settings/app-settings';
import { GroupProvider } from '../providers/group/group';
import { GoogleMaps } from '@ionic-native/google-maps';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
//import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

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
    BackgroundGeolocation,
    Geolocation,
    GoogleMaps,
    Camera,
    FileTransfer,
    FileChooser,
    LaunchNavigator,
    CallNumber,
    FCM,
    SocialSharing,
    File
    
    //NativeGeocoder
  ]
})
export class AppModule {}
