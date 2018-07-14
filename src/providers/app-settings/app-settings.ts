import { Injectable } from '@angular/core';


@Injectable()
export class AppSettingsProvider {

  private apiURL: string = 'http://34.210.14.110/api/index.php/';
  private profilePicturePath: string = 'http://34.210.14.110/api/assets/profile_image/';
  private defaultProfilePicture = 'assets/img/avatar.jpeg'
  private notificationPicture = 'http://34.210.14.110/api/assets/notification_image/';

  // private apiURL: string = 'http://162.144.41.156/~izaapinn/HMGPS-API/';
  // private profilePicturePath: string = 'http://162.144.41.156/~izaapinn/HMGPS-API/assets/profile_image/';
  // private defaultProfilePicture = 'assets/img/avatar.jpeg'
  // private notificationPicture = 'http://162.144.41.156/~izaapinn/HMGPS-API/assets/notification_image/';
 // private apiURL: string = 'http://localhost/HMGPS-API/';
  constructor() {}

  /**
   * getApiURL
   */
  public getApiURL() {
    return this.apiURL;
  }

  /**
   * getDefaultProfilePicture
   */
  public getDefaultProfilePicture() {
    return this.defaultProfilePicture;
  }

  /**
   * getProfilePicturePath
   */
  public loadProfilePicture(image: string) {
    if (image) {
      return this.profilePicturePath + image;
    } else {
      return this.profilePicturePath;
    }
  }

  public uploadNotificationPicture(){
    return this.notificationPicture;
  }



}
