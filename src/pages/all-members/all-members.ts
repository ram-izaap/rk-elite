import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';
import { AppSettingsProvider } from '../../providers/app-settings/app-settings';

//INTERFACES
import { UserInterface, MemberInterface, SearchInterFace } from '../../interfaces/user';

@IonicPage()
@Component({
  selector: 'page-all-members',
  templateUrl: 'all-members.html',
})
export class AllMembersPage {
  userInfo: any;
  search: SearchInterFace;
  members: Array<MemberInterface> = [];
  private profilePictureUrl: string = '';
  private defaultProfilePicture: string = '';
  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              private groupProvider: GroupProvider,
              private userProvider: UserProvider,
              private appSettingsProvider: AppSettingsProvider
            ) {

    this.userProvider.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    //this.membersLists();

    this.search = {
      user_id:this.userInfo.profile.id,
      joinKey:this.userInfo.group.currentMapJoinKey
    };
 
    this.groupProvider.getMembersByGroup(this.search).subscribe(mappedMembers => {
      this.members = mappedMembers;
      console.log(this.members);
      this.profilePictureUrl = this.appSettingsProvider.loadProfilePicture('');
			this.defaultProfilePicture = this.appSettingsProvider.getDefaultProfilePicture();
    });

  }

  
  
}
