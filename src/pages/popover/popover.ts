import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController
            ) {
  }

  editProfile(){
    let mapModal = this.modalCtrl.create('UpdatePage', { updateType : "profile"});
        mapModal.present();
  }
 
  changePassword(){
    let mapModal = this.modalCtrl.create('UpdatePage', { updateType : "password"});
        mapModal.present();
  }
   
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

}
