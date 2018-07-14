import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ActionSheetController,ToastController  } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
import { Tabs, Tab } from 'ionic-angular';


import { ScrollableTabsDirective } from '../../directives/scrollable-tabs/scrollable-tabs';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserInterface, MemberInterface, SearchInterFace } from '../../interfaces/user';

@Component({
  selector: 'participants-list',
  templateUrl: 'participants-list.html'
})
export class ParticipantsListComponent {

  text: string;
  userInfo: any;
  search: SearchInterFace;
  members: Array<MemberInterface> = [];
  phNo : any;
  emailId : any;
  mailIcon : any;
  phIcon : any;
  part : string = 'show';
  joinkey: string;

  tabsColor: string = "default";
  tabsMode: string = "md";
  tabsPlacement: string = "bottom";
  
  tabOne: string = 'AllMembersPage';
  tabTwo: string = 'VisiblesMembersPage';
  tabThree: string = 'InVisiblesMembersPage';
  tabFour: string = '';
  tabFive: string = '';

  tabToShow: Array<boolean> = [true, true, true, true, true, true, true, true, true];
  scrollableTabsopts: any = {};

  constructor( 
              private navCtrl: NavController, 
              private groupProvider: GroupProvider,
              private userProvider: UserProvider,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              public actionSheetCtrl: ActionSheetController,
              private launchNavigator: LaunchNavigator, 
              private callNumber: CallNumber,
              private toastCtrl: ToastController
            ) 
  {
    console.log('Hello ParticipantsListComponent Component');
    this.text = 'Hello World';

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
    });


  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  membersLists(){
  }

  locations(member: MemberInterface) {
    console.log('member', member);
    this.navCtrl.setRoot('SearchPage', { lat: member.position.latitude, lon:member.position.longitude, joinkey:this.joinkey} );
  }

  contacts(member: MemberInterface){

    console.log('member', member);

    if(member.group.userType == 'admin' ){
      this.phNo = member.profile.phoneNumber;
      this.mailIcon = 'md-mail';
      this.emailId = member.profile.email;
      this.phIcon = 'md-call';
    }
    else
    {
      this.phNo = '';
      this.emailId = '';
      this.mailIcon = '';
      this.phIcon = '';
    }
    let actionSheet = this.actionSheetCtrl.create({
      //title: 'Modify your album',
      buttons: [
            {
                text: this.emailId,
                icon: this.mailIcon,
                handler: () => {
                // console.log('Email id clicked');
                    // Share via email
                    // this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
                    //   // Success!
                    // }).catch(() => {
                    //   // Error!
                    // });
                }
            },
              {
                text:  this.phNo,
                icon: this.phIcon,
                handler: () => {
                  console.log('Phone no clicked');
                  this.callNumber.callNumber("18001010101", true)
                  .then(res => console.log('Launched dialer!', res))
                  .catch(err => console.log('Error launching dialer', err));
              }
            },
              {
                text: 'Show on google map',
                icon: 'md-map',
                handler: () => { 
                    console.log('Show on google map clicked');
                  this.launchNavigator.navigate([member.position.latitude, member.position.longitude]);
                  // .then(
                  // success => console.log('Launched navigator'),
                  // error => console.log('Error launching navigator', error)
                  // );
                }
              },
                { 
                    text: 'Remove from channel',
                    icon: 'md-trash',
                    handler: () => {
                    // console.log('Remove from channel clicked');
                        this.userProvider.removeChannel(member.profile.id,member.group.joinKey).subscribe(resp => {
                            let httpResponse: any = resp;
                            if(httpResponse.status == 'success'){
                                let toast = this.toastCtrl.create({
                                  message: 'Channel removed successfully',
                                  duration: 3000,
                                  position: 'top',
                                  cssClass: 'dark-trans',
                                  closeButtonText: 'OK',
                                  showCloseButton: true
                                });
                                toast.present();
                            }
                        }); 
                    }
              },
              {
                  text: 'Block',
                  icon: 'md-alert',
                  handler: () => {
                    // console.log('Block clicked');
                      this.userProvider.userBlock(member.profile.id,member.group.id).subscribe(resp => {
                        let httpResponse: any = resp;
                        if(httpResponse.status == 'success'){
                            let toast = this.toastCtrl.create({
                              message: 'User Blocked successfully',
                              duration: 3000,
                              position: 'top',
                              cssClass: 'dark-trans',
                              closeButtonText: 'OK',
                              showCloseButton: true
                            });
                            toast.present();
                        }
                      });
                  }
                },
                {
                    text: 'Cancel',
                    icon: 'md-close',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                }
            ]
    });
    actionSheet.present();
  }

  refreshScrollbarTabs() {
    this.scrollableTabsopts = { refresh: true };    
  }

  renderMember(){
    
  }

  
}
