import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ToastController } from 'ionic-angular';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserInterface, GroupInterface} from '../../interfaces/user';
//import { GroupOptions,GroupLists,GroupInfo } from '../../interfaces/group';
/**
 * Generated class for the StationIdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-station-id',
  templateUrl: 'station-id.html',
})
export class StationIdPage {
  public  groups: Array<GroupInterface> = [];
  private userInfo: UserInterface;
  public stationid : any; 
  public joinKey : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private groupProvider: GroupProvider,
    private userProvider: UserProvider,private toastCtrl: ToastController) {
      this.userProvider.userInfo$.subscribe(userInfo => {
        this.userInfo = userInfo;
        this.mapLists();
        console.log(userInfo);
      });
    //  this.groupProvider.selectStationId(this.userInfo.profile.id).subscribe(result => {
    //       let httpResponse: any = result;
    //       console.log(httpResponse);
    //       this.stationid = httpResponse.station_id.station_id;
          
    //       // this.userInfo.profile.profileImage = this.appSettingsProvider.getApiURL() + 'assets/profile_image/' + this.imageFileName;
		// 			// this.userProvider.userInfoSource.next(this.userInfo);
    //  }); 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StationIdPage');
  }



   mapLists(){   
    
    this.groupProvider.getMapsByUserID(this.userInfo.profile.id).subscribe(mappedGroups => {
      this.groups = mappedGroups;      
      console.log('groups', this.groups);
    }); 
  }

  update(joinKey:any){
    console.log(joinKey);
          this.groupProvider.updateStationId(joinKey,this.userInfo.profile.id).subscribe(result => {
             //console.log(result);
             let httpResponse: any = result;
                    let toast = this.toastCtrl.create({
                      message: httpResponse.message,
                      duration: 3000,
                      position: 'top',
                      cssClass: 'dark-trans',
                      closeButtonText: 'OK',
                      showCloseButton: true
                    });
              toast.present();
             // this.navCtrl.setRoot('ProPlansPage');
             this.userInfo.profile.stationID = joinKey;
					this.userProvider.userInfoSource.next(this.userInfo);
          });
 
  }

}
