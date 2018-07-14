import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ToastController,AlertController } from 'ionic-angular';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the NotificationViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-view',
  templateUrl: 'notification-view.html',
})
export class NotificationViewPage {
  public notifications_view : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl: ViewController,
    private groupProvider: GroupProvider,
    private toastCtrl: ToastController,private alertController: AlertController) {
   this.notifications_view = navParams.get('notification_view');
   //console.log(this.notifications_view.joinKey);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationViewPage');
  }

  dismiss() 
    {
       this.viewCtrl.dismiss();
    }


    reply(notificationsReply){
           // console.log(notificationsReply);
         this.navCtrl.setRoot('MessagePage',{data : notificationsReply}); 
    }

    share(notificationsData){
        this.navCtrl.setRoot('ShareLocationPage',{data : notificationsData, type: 'notification'});
    }

    delete(notificationsData){
            this.groupProvider.deleteNotifications(notificationsData.notificationId).subscribe(result => {
              console.log(result);
              let httpResponse: any = result;
              if(httpResponse.status == 'success'){
                    let toast = this.toastCtrl.create({
                      message: httpResponse.message,
                      duration: 3000,
                      position: 'top',
                      cssClass: 'dark-trans',
                      closeButtonText: 'OK',
                      showCloseButton: true
                    });
                toast.present();
              }else{
                  let missingCredentialsAlert = this
                  .alertController
                  .create({
                    message: httpResponse.message,
                    buttons: [
                      {
                      text: "Ok",
                      role: 'cancel'
                      }
                    ]
                  });
                missingCredentialsAlert.present();
              }
          });

    }

}
