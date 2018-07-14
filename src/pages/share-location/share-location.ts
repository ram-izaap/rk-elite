import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

//PROVIDERS
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserInterface } from '../../interfaces/user';


@IonicPage()
@Component({
  selector: 'page-share-location',
  templateUrl: 'share-location.html',
})
export class ShareLocationPage {
  private msg : any;
  private type: string;
  private link: string;

  private userInfo: UserInterface;

  constructor(
            public navCtrl: NavController, 
            public navParams: NavParams,
            private viewCtrl: ViewController,
            private socialSharing: SocialSharing,
            private userProvider: UserProvider
    ) 
    {

      this.userProvider.userInfo$.subscribe(userInfo => {
        this.userInfo = userInfo;
      });

      if(navParams.get('data')){
        this.msg  = this.navParams.get('data');
        this.type = this.navParams.get('type');
      } 
      else
      {
        
        this.link = "https://911gps.me/"+this.userInfo.group.currentMapJoinKey;
      }

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShareLocationPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  shareViaEmail(){
      
        let subject = (this.type == 'notification')?"Notification":"View My Current Map Location";
        this.msg    = (this.type == 'notification')?this.msg:'Hi, My Map ID is: '+ this.link;
        this.socialSharing.shareViaEmail(this.msg, subject, null, null);
   }

  //  shareViaGoogle(){
  //   this.msg = 'test';
  //   this.socialSharing.shareViaEmail(this.msg, null, null, null);
  //  }

   shareViaWhatsUp(){
   
        this.msg = (this.type == 'notification')?this.msg:" My Map ID is";

        this.socialSharing.shareViaWhatsApp(this.msg, null, this.link);
      
   }

   shareViaFacebook(){
      
        this.msg = (this.type == 'notification')?this.msg:" My Map ID is";
        this.socialSharing.shareViaFacebook(this.msg, null, this.link);
      
   }

   shareViaTwitter(){
      
        this.msg = (this.type == 'notification')?this.msg:" My Map ID is";
        this.socialSharing.shareViaTwitter(this.msg, null, this.link);
      
   }

}
