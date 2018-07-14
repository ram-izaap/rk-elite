import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController,AlertController, ActionSheetController,ToastController,LoadingController   } from 'ionic-angular';
//import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

//PROVIDERS
import { UserProvider } from '../../providers/user/user';
import { AppSettingsProvider } from '../../providers/app-settings/app-settings';

//INTERFACES
import { UserInterface, ProfileInterface } from '../../interfaces/user';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private userInfo: UserInterface;
  public imageFileName: any;
  private profilePicture: string = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
	private userProvider: UserProvider,
	private appSettingsProvider: AppSettingsProvider,
    private alertController: AlertController,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    private transfer: FileTransfer
  ) {
      
		
  }

	ionViewWillEnter() {
		this.userProvider.userInfo$.subscribe(userInfo => {
			this.userInfo = userInfo;
			if (this.userInfo.profile.profileImage === '') {
				this.profilePicture = this.appSettingsProvider.getDefaultProfilePicture();
			} else {
				this.profilePicture = this.appSettingsProvider.loadProfilePicture(this.userInfo.profile.profileImage);
			}

		//	console.log(this.userInfo, this.userInfo.profile.profileImage);
		});
	}

	private updateProfilePicture(){
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Choose your profile photo',
			buttons: [
				{
					text: 'Take a Picture',
					handler: () => {
						// this.updateURI();
					this.gotoCamera('camera');
					}
				},
				{
					text: 'Choose from Album',
					handler: () => {
						this.gotoCamera('library');
					}
				},
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

	private gotoCamera(type: string = 'camera')
	{
		const options: CameraOptions = {
			quality: 70,
			sourceType: (type === 'camera') ? this.camera.PictureSourceType.CAMERA: this.camera.PictureSourceType.PHOTOLIBRARY,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			saveToPhotoAlbum: false
		}

		this
			.camera
			.getPicture(options)
			.then((fileURI: string) => {
				console.log(fileURI);
				this.upload(fileURI);
			})
			.catch((err) => {
				let error = this.alertController.create({
					title:'Error',
					message:err,
					buttons:['OK']
				});
				error.present();
				return false;
			});
	} 
    
	private upload(fileURI: string = '') {	 
		
		if (fileURI == '') return;

		this.imageFileName = Math.floor(Math.random()* 1000000) + '-' + this.userInfo.profile.id + '.jpg';
		
		// initiate loader
		let loader = this.loadingCtrl.create({
			content: "Uploading..."
		});
		loader.present();

		const fileTransfer: FileTransferObject = this.transfer.create();
		let options: FileUploadOptions = {
			fileKey: 'file',
			fileName: this.imageFileName,
			chunkedMode: false,
			mimeType: "image/jpeg",
			headers: {}
		}
		let targetUrl = this.appSettingsProvider.getApiURL() + 'notification_upload/profile_upload';
		fileTransfer.upload(fileURI, targetUrl, options)
		.then((data) => { 
				let profileUpdateData: ProfileInterface = {
					id: this.userInfo.profile.id,
					profileImage: this.imageFileName
				};   
				this
					.userProvider
					.updateProfile(profileUpdateData)
					.subscribe(result => {
						loader.dismiss();
						this.presentToast("Image uploaded successfully");
						// this.userInfo.profile.profileImage = this.appSettingsProvider.getApiURL() + 'assets/profile_image/' + this.imageFileName;
						// this.userProvider.userInfoSource.next(this.userInfo);
						// this.profilePicture = this.appSettingsProvider.getApiURL() + 'assets/profile_image/' + this.imageFileName;
						this.profilePicture = this.appSettingsProvider.loadProfilePicture(this.imageFileName);
					
					});
			}, 
			(err) => {
				// alert("error"+JSON.stringify(err));
				loader.dismiss();
				this.presentToast(err);
			}
		);

	}

	private presentToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 3000,
			position: 'bottom'
		});
		toast.onDidDismiss(() => { console.log('Dismissed toast'); });
		toast.present();
	}



	presentPopover(ev) {
		let popover = this.popoverCtrl.create('PopoverPage');
		popover.present({ev:ev});
	} 

}
