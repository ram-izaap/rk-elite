import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
//import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';


//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserInterface, GroupInterface} from '../../interfaces/user';
//import { GroupOptions,GroupLists,GroupInfo } from '../../interfaces/group';


@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})

export class MapsPage {

  public  groups: Array<GroupInterface> = [];
  private userInfo: UserInterface;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public modalCtrl: ModalController,
              private groupProvider: GroupProvider,
              private userProvider: UserProvider
            ) 
            {

          
          
  }

  ionViewWillEnter(){
    this.userProvider.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
      this.mapLists();
      console.log(userInfo);
    });
  }

  mapLists(){   
    
    this.groupProvider.getMapsByUserID(this.userInfo.profile.id).subscribe(mappedGroups => {
      this.groups = mappedGroups;      
      console.log('groups', this.groups);
    }); 
  }

  openPage(group:GroupInterface, pageType: string = 'create'){
    let options: any = {pageType: pageType};
    if(group){      
      options.group = group;
    }    
    let mapModal = this.modalCtrl.create('CreateMapPage', options);
    mapModal.present();
     mapModal.onDidDismiss(resp => {
        //console.log('JJJJJJJJJJJj');
        this.ionViewWillEnter();
      });
  }
  
}
