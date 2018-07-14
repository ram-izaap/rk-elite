import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,ModalController } from 'ionic-angular';

import { UserInterface, MemberInterface, SearchInterFace } from '../../interfaces/user';

import { UserProvider } from '../../providers/user/user';
import { GroupProvider } from '../../providers/group/group';
@IonicPage()
@Component({
  selector: 'page-searchpagetoggle',
  templateUrl: 'searchpagetoggle.html',
})
export class SearchpagetogglePage {
  search: SearchInterFace;
  userInfo: any;
  members: Array<MemberInterface> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewController: ViewController,
    private modalCtrl:ModalController,private userProvider: UserProvider,private groupProvider: GroupProvider) {
      this.userProvider.userInfo$.subscribe(userInfo => {
        this.userInfo = userInfo;
      });
      this.search = {
        user_id:this.userInfo.profile.id,
        joinKey:this.userInfo.group.currentMapJoinKey
      };
   
      this.groupProvider.getMembersByGroup(this.search).subscribe(mappedMembers => {
        this.members = mappedMembers;
        console.log(this.members);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchpagetogglePage');
  }

  participants(){
    let participantsModal = this.modalCtrl.create('ParticipantsPage');
    participantsModal.present();
  }

  userClues(){
    
  }

  dismiss() {
    this.viewController.dismiss();
  }

}

