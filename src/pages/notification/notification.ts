import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController,ToastController,AlertController,ModalController } from 'ionic-angular';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';
import { AppSettingsProvider} from '../../providers/app-settings/app-settings';
//INTERFACES
import { UserInterface} from '../../interfaces/user';	

//import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage
{
	private userInfo: UserInterface;
	public  notifications: any;
	private defaultProfilePicture: string = '';
	private profilePictureUrl: string = '';
	private notificationPictureUrl: string = '';
	constructor(public navCtrl: NavController, public navParams: NavParams,
				public actionSheetCtrl:ActionSheetController,
				public alertCtrl:AlertController,
				private modalCtrl:ModalController,
				private userProvider: UserProvider,
				private appSettingsProvider:AppSettingsProvider,
				private groupProvider: GroupProvider,
			    private toastCtrl: ToastController,private alertController: AlertController) {

	}
  


	ionViewWillEnter() 
 	{
		this.userProvider.userInfo$.subscribe(userInfo => {
			this.userInfo = userInfo;
			// if (this.userInfo.profile.profileImage === '') {
			// 	this.profilePicture = this.appSettingsProvider.getDefaultProfilePicture();
			// } else {
			// 	this.profilePicture = this.appSettingsProvider.loadProfilePicture(this.userInfo.profile.profileImage);
			// }
		//	console.log(this.profilePicture);
			this.listNotifications();
		});
	}

	
	 
	listNotifications() {
		//console.log(this.userInfo.group.joinKey);
		let userId: string = '' + this.userInfo.profile.id;
		let joinKey: string = '' + this.userInfo.group.joinKey;
		this.userProvider.getNotifications(userId,joinKey).subscribe(mappedNotifications => {
			console.log(mappedNotifications);	
			this.notifications = mappedNotifications;
			this.notificationPictureUrl = this.appSettingsProvider.uploadNotificationPicture();
			this.profilePictureUrl = this.appSettingsProvider.loadProfilePicture('');
			this.defaultProfilePicture = this.appSettingsProvider.getDefaultProfilePicture();       
		}); 
	}

	
	add_message(){
		// this.navCtrl.push('Add_Messagepage');
		let notificationModal = this.modalCtrl.create('MessagePage');
		notificationModal.present();

		notificationModal.onDidDismiss(resp => {
			//console.log('JJJJJJJJJJJj');
			this.ionViewWillEnter();
		});
	}

	notification_view(notification){
	
		let notificationView = this.modalCtrl.create('NotificationViewPage',{notification_view : notification});
		notificationView.present();
	}

	reply(notificationsReply){
        console.log(notificationsReply);
		let reply = this.modalCtrl.create('MessagePage',{data : notificationsReply});
		reply.present();

		reply.onDidDismiss(resp => {
			this.ionViewWillEnter();
		});
		//this.navCtrl.setRoot('MessagePage',{data : notificationsReply});
		
	}

	share(notificationsData){
		let share = this.modalCtrl.create('ShareLocationPage',{data : notificationsData});
		share.present();

		share.onDidDismiss(resp => {
			this.ionViewWillEnter();
		});
		//this.navCtrl.setRoot('ShareLocationPage',{data : notificationsData, type: 'notification'});
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
			  this.ionViewWillEnter();
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

