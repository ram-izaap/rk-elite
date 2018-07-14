import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams,ActionSheetController,AlertController,ViewController, LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';

//PROVIDERS
//import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';
import { AppSettingsProvider } from '../../providers/app-settings/app-settings';
//INTERFACES
import { UserInterface} from '../../interfaces/user';	
/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
     private userInfo: UserInterface;
     private notification_form: FormGroup;
     public notification: NotificationDataInterface;
     public userImage : any;
     public notificationReply : any;
     public replyNotifications : any;
     //public imageURI: any;
     public random : any;
      public imageFileName: any;
     constructor(public navCtrl: NavController, public navParams: NavParams,
      public actionSheetCtrl:ActionSheetController,public alertCtrl:AlertController,
      private camera: Camera,private viewController: ViewController,
      private _formBuilder: FormBuilder,
      public alertController:AlertController,
      private userProvider:UserProvider,private transfer: FileTransfer, 
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,private fileChooser: FileChooser,
      private appSettingsProvider: AppSettingsProvider,) 
      {
          this.notification_form = this._formBuilder.group({
            //link
            link: [""],

            message: [""],
          
          }); 

          this.userProvider.userInfo$.subscribe(userInfo => {
            this.userInfo = userInfo;
          // console.log( this.userInfo.group.joinKey);
            });
      }

    ionViewDidLoad() {
      //console.log('ionViewDidLoad MessagePage');
    }

    dismiss() 
    {
       this.viewController.dismiss();
    }

     gallery()
    {
       this._gotoCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
    }
   
    photoCamera()
    {
       this._gotoCamera(this.camera.PictureSourceType.CAMERA);
    }

    document(){

        this.fileChooser.open()
        .then(uri =>  this.userProvider.getFileInfo(uri).then(file => {
           console.log('success'+ file);

        }))
        .catch(e => console.log(e));
    }

    _gotoCamera(type)
		{
          const options: CameraOptions = {
              quality: 70,
              // targetWidth: 300,
              // targetHeight: 300,
              sourceType: type,
              // allowEdit: false,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              saveToPhotoAlbum: false
          }
            this.camera.getPicture(options).then((fileURI: string) => {
            console.log(fileURI);
            this.imageURI(fileURI);
            })
          .catch((err) => {
            let error = this.alertCtrl.create({
              title:'Error',
              message:err,
              buttons:['OK']
            });
            error.present();
            return false;
          });
		} 
		
	imageURI(fileURI: string = ''){	 
		 if (fileURI == '') return;
        this.imageFileName = Math.floor(Math.random()* 1000000) + 'name.jpg';
        let loader = this.loadingCtrl.create({
          content: "Uploading..."
        });
        loader.present();
        const fileTransfer: FileTransferObject = this.transfer.create();
      
        let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: this.imageFileName,
          //fileName: 'ionicfile',
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {}
        }
        let targetUrl = this.appSettingsProvider.getApiURL() + 'notification_upload/upload';
        fileTransfer.upload(fileURI, targetUrl, options)
          .then((data) => {    
            //console.log("success");
            // this.imageFileName = data;
            // alert("success"+JSON.stringify(data));
            loader.dismiss();
            this.presentToast("Image uploaded successfully");

          }, 
          (err) => { 
            
            alert("error"+JSON.stringify(err));
            loader.dismiss();
            this.presentToast(err);

        });
  
  }
  

  filesURI(fileURI: string = ''){	 
    if (fileURI == '') return;
      // this.imageFileName = Math.floor(Math.random()* 1000000) + 'name.pdf';
       let loader = this.loadingCtrl.create({
         content: "Uploading..."
       });
       loader.present();
       const fileTransfer: FileTransferObject = this.transfer.create();
     
       let options: FileUploadOptions = {
         fileKey: 'file',
         fileName: fileURI,
         chunkedMode: false,
         mimeType: "application/pdf",
         headers: {}
       }
       let targetUrl = this.appSettingsProvider.getApiURL() + 'notification_upload/upload';
       fileTransfer.upload(fileURI, targetUrl, options)
         .then((data) => {    
           //console.log("success");
           // this.imageFileName = data;
           // alert("success"+JSON.stringify(data));
           loader.dismiss();
           this.presentToast("Files uploaded successfully");

         }, 
         (err) => { 
           
           alert("error"+JSON.stringify(err));
           loader.dismiss();
           this.presentToast(err);

       });
 
 }
	
    presentToast(msg) {

      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom'
      });
    
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
    
      toast.present();
    }

    
    
    send()
    {
       //alert(this.imageFileName);
      this.notificationReply = this.navParams.get('data');

      if(this.notificationReply){
            
            this.replyNotifications = {
              //userId :  this.userInfo.profile.id,
              message: this.notification_form.value.message,
              link: this.notification_form.value.link,
              sender: this.notificationReply.senderId,
              jkey : this.userInfo.group.currentMapJoinKey,
              image : this.imageFileName
            };

            this.userProvider.Notification(this.replyNotifications).subscribe(result => {
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
                  this.dismiss();
                }else{
                  this.dismiss();
                  this.presentToast(httpResponse.message);
              }
          });

           
      }
      else
      {
     
          this.notification = {
            message: this.notification_form.value.message,
            link: this.notification_form.value.link,
            sender: this.userInfo.profile.id,
            receiver: this.userInfo.group.id,
            jkey : this.userInfo.group.joinKey,
            image : this.imageFileName
          };
          
          //console.log(this.notification);
          this.userProvider.Notification(this.notification).subscribe(result => {
            let httpResponse: any = result;
            //console.log(httpResponse);	
            //  this.dismiss();
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
                  this.dismiss();
                }else{
                  this.dismiss();
                  this.presentToast(httpResponse.message);
              }
          }); 
      }    

    }
 

}


export interface NotificationDataInterface {
  message: string,
  link: string,
  sender: number,
  receiver: number,
  jkey : string,
  image : string,
}