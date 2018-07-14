import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

//INTERFACES
//import { GroupOptions,GroupLists,GroupInfo } from '../../interfaces/group';
import { MemberInterface } from '../../interfaces/user';

import { ParticipantsListComponent } from '../../components/participants-list/participants-list';
import { ScrollableTabsDirective } from '../../directives/scrollable-tabs/scrollable-tabs';
import { TabsDirective } from '../../directives/tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-current-map-members',
  templateUrl: 'current-map-members.html',
})
export class CurrentMapMembersPage {
  private userInfo;
  private search;
  private members: Array<MemberInterface> = [];
  public mem : string = 'show';

  constructor(
    
              public navCtrl: NavController, 
              public navParams: NavParams,
              private groupProvider: GroupProvider,
              private userProvider: UserProvider

            ) {
  }

  ionViewWillEnter(){
    
    this.userProvider.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });
    
    this.membersLists();

  }

  membersLists(){   
    
    this.search = {
                    user_id:this.userInfo.profile.id,
                    joinKey:this.userInfo.profile.stationID
    };

    this.groupProvider.getMembersByGroup(this.search).subscribe(mappedMembers => {
      this.members = mappedMembers;      
      console.log('members', this.members);
    });

  }

}
