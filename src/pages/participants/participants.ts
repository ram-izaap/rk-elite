import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ActionSheetController,ToastController  } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
//import { SocialSharing } from '@ionic-native/social-sharing';
//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserInterface, MemberInterface, SearchInterFace } from '../../interfaces/user';


@IonicPage()
@Component({
  selector: 'page-participants',
  templateUrl: 'participants.html',
})
export class ParticipantsPage {
  private userInfo: UserInterface;
  private search: SearchInterFace;
  private members: Array<MemberInterface> = [];
  public phNo : any;
  public emailId : any;
  public mailIcon : any;
  public phIcon : any;
  public part : string = 'show';
  private visibles: any ;
  private inVisibles: any;
  private clues: any;
  private joinkey: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private groupProvider: GroupProvider,
    private userProvider: UserProvider,
    public actionSheetCtrl: ActionSheetController,
    public geolocation: Geolocation,
    private launchNavigator: LaunchNavigator, 
    private callNumber: CallNumber,
    private toastCtrl: ToastController,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParticipantsPage');
  }

  ionViewWillEnter(){

      this.userProvider.userInfo$.subscribe(userInfo => {
        this.userInfo = userInfo;
      //this.membersLists();
      // console.log(this.userInfo); 
      });

     
  }

  dismiss() {
       this.viewCtrl.dismiss();
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
                  text:  this.emailId,
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
  

}
