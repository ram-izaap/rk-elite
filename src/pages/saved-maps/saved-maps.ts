import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController } from 'ionic-angular';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserInterface, SavedMapsInfo } from '../../interfaces/user';


@IonicPage()
@Component({
  selector: 'page-saved-maps',
  templateUrl: 'saved-maps.html',
})
export class SavedMapsPage {
  private userInfo: UserInterface;
  private members: SavedMapsInfo;
  public pet : string = 'private';
  private show: boolean = false;

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      private userProvider: UserProvider,
      private groupProvider: GroupProvider,
      private toastCtrl: ToastController,
      private alertController: AlertController,
    ) 
  {

    // this.userProvider.userInfo$.subscribe(userInfo => {
    //   this.userInfo = userInfo;
    //   this.getMembersByUser();
    // });

  }

  ionViewWillEnter(){

    this.userProvider.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
      this.getMembersByUser();
    });
   
  }

  getMembersByUser(){
  
    this.groupProvider.getMapsByUser(this.userInfo.profile.id).subscribe(( resp : any ) => {
      this.show = true;
      
      if(resp.status == 'error'){
        
        this.members = resp;
           
      }
      else
      { 
          
          this.members = {
            privateMaps:resp.privateMaps,
            publicMaps:resp.publicMaps
          }
          console.log(this.members);
      }

    });

  }


  view(joinkey){
    //alert(joinkey);
    this.navCtrl.setRoot('SearchPage', {joinkey: joinkey});
  }

  favourite(groupid){
          this.groupProvider.updateFavourite(this.userInfo.profile.id,groupid).subscribe(result => {
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
           this.getMembersByUser();

        });
  }


    delete(groupid){
        
            this.groupProvider.deleteGroups(groupid).subscribe(result => {
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
              this.getMembersByUser();
          });
    }

}
