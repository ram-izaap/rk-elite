import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { 
         GoogleMaps, 
         GoogleMap, 
         GoogleMapsEvent, 
         GoogleMapOptions,
         HtmlInfoWindow,
         Marker,
         MarkerIcon,
         MarkerLabel,
         CameraPosition,
         MarkerCluster,
         ILatLng,
         LatLngBounds
         
        } from '@ionic-native/google-maps';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';


//INTERFACES
import { UserInterface, MemberInterface, SearchInterFace, MemberLocation, UserTags, UserTagsIcons } from '../../interfaces/user';



@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  private _searchForm: FormGroup;
 
  map: GoogleMap;
  public lat = 13.0827;
  public lon = 80.1914;
  private joinkey : any;
  public title : any;
  public icon : any;
  private userInfo: UserInterface;
  private search: SearchInterFace;
  private members: Array<MemberInterface> = [];
  private labelOptions: MarkerLabel;
  private visibleMembers: Array<MemberInterface> = [];
  private inVisibleMembers: Array<MemberInterface> = [];
  private clues: Array<MemberInterface> = [];
  private locations:Array<any> = [];
  private userTagsIcons: Array<UserTags> = [];
  private channelID: any;
 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private groupProvider: GroupProvider,
    private userProvider: UserProvider,
    private modalCtrl:ModalController,
    private _formBuilder: FormBuilder,
    private alertController: AlertController
  ) 
  {
     //display join key in search form
     this.joinkey = this.navParams.get('joinkey');
	//Form
	this._searchForm = _formBuilder.group({
		//Default ID
		join_key: [this.joinkey,
				Validators.compose([
				Validators.required
				])
		],
		password: ["",
			Validators.compose([
			])
		]
	});

    

  }
  
  ionViewWillEnter(){
  
    this.userProvider.userInfo$.subscribe(userInfo => {
      	this.userInfo = userInfo;
     	console.log(this.userInfo); 
    });
    
    this.loadMap();

    if(this.navParams.get('lat') && this.navParams.get('lon')) {
      this.lat   = this.navParams.get('lat');
      this.lon   = this.navParams.get('lon');
      console.log(this.lat+" "+this.lon);
      this.prepareData();
    }

    if(this.navParams.get('joinkey')) {

      this.prepareData();
    }

  }

  loadMap() 
  {
      this.createMap();
  }
  
  createMap()
  {

      let mapOptions: GoogleMapOptions = {

        controls: {
          'compass': true,
          'myLocationButton': true,
          'myLocation': true,
          'indoorPicker': true,
          'zoom': true,          
          'mapToolbar': true     
        },
        gestures: 
        {
          scroll: true,
          tilt: true,
          zoom: true,
          rotate: true
        },
        styles: [],
        camera: 
        {
          target: 
          [
            {
              lat: this.lat, 
              lng: this.lon
            },
          ]
        },
        preferences: 
        {
            zoom: 
            {
              minZoom: 9,
              maxZoom: 18
            },
            padding: 
            {
              left: 10,
              top: 10,
              bottom: 10,
              right: 10
            },
            building: true
        }

      };
  
      this.map = GoogleMaps.create('map', mapOptions);
     // this.prepareData();
      this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
       });
    
       
  }

  prepareData()
  {
    
        this.map.clear();

        let searchKey = "";
        this.joinkey  = this.navParams.get('joinkey');

        console.log(this.joinkey);
        
        if(this.joinkey){
          searchKey = this.joinkey;  
        }
        else if(this._searchForm.value.join_key){
          searchKey = this._searchForm.value.join_key;
        }
        
        this.joinkey = searchKey;
      
 
       //change user current map id
       this.userInfo.group.currentMapJoinKey = this.joinkey;
       this.userProvider.userInfoSource.next(this.userInfo);
       
        this.search = {
          user_id:this.userInfo.profile.id,
          joinKey:searchKey,
          password: this._searchForm.value.password
        };
      
        this.groupProvider.isValidate(this.search).subscribe( ( resp: any ) => {
			console.log('UUU', resp);    
          	if(resp.status == 'error'){
              console.log('WWW', resp);    
              if(resp.type == 'REQUEST'){

                  let allowDenyNotificationAlert = this
                  .alertController
                  .create({
                    message: resp.message,
                    buttons: [
                      {
                        text: "Send",
                        handler: (data) => {

                          console.log(data);
                          console.log('Sending Notification');

                          //send notification to admin
                          this.allowDenyNotificationSendToAdmin();

                        }

                      },
                      {
                        text: "Cancel",
                        role: 'cancel'
                      }

                    ]

                  });

                  allowDenyNotificationAlert.present();
              }
              else
              {
                let passwordProtectAlert = this
                  .alertController
                  .create({
                    message: resp.message,
                    buttons: [
                      {
                        text: "Ok",
                        role: 'cancel'
                      }
                    ]

                  });

                  passwordProtectAlert.present();
              }

            }
            else
            {

              this.groupProvider.getMembersByGroup(this.search).subscribe( ( res: any ) => {
              
              //  console.log(res);

             //  if(res.status == 'success') {

                this.members = res;
                //console.log(this.members);

                for(let member of this.members)
                {

                    if(member.group.locationType == 'DYNAMIC'){
            
                      if(member.group.view == 1){
                        this.visibleMembers.push(member);

                        this.renderMarkers(member);
                      }
            
                      if(member.group.view == 0){
                        this.inVisibleMembers.push(member);
                      }

                      this.title  = member.profile.defaultID;
                    }
                    else if(member.group.locationType == 'STATICMAP')  
                    {
                      this.clues.push(member);
                    }

                  }

                  console.log("Visibles:"+this.visibleMembers);
                  console.log("Invisibles"+this.inVisibleMembers);
                
              //  } 
              //  else
             //   {

                      // let groupDoesnotExistsAlert = this
                      // .alertController
                      // .create({
                      //   message: resp.message,
                      //   buttons: [
                      //     {
                      //       text: "Ok",
                      //       role: 'cancel'
                      //     }
                      //   ]
                      // });

                      // groupDoesnotExistsAlert.present();
                      
               // }
               

              });   

            }

        });
    
  }

  // getMemberUserTags(){

  //     this.groupProvider.getMemberUserTagByChannelID(this.channelID).subscribe( ( resp: any ) => {
  //       this.icon = resp.filename;
  //     });

  // }

  renderMarkers(member) {

      // if(member.group.userType == 'admin'){   
      //   this.icon = 'assets/img/violet-icon.png';     
      // }
      // else
      // {
      //   this.icon = 'assets/img/green-icon.png';
      // }

      this.groupProvider.getMemberUserTagByChannelID(member.profile.defaultID,member.group.userType).subscribe( ( resp: any ) => {

        this.icon = resp.filename;

        if(this.icon != ''){

          this.map.addMarker({
                position: {
                  "lat": member.position.latitude,
                  "lng": member.position.longitude
                },
                icon: this.icon,
                data: ''
              })
              .then((marker: Marker) => {
              this.infoWindow(member, marker); 
              this.map.setCameraTarget(marker.getPosition());
          });  
          
        }

      });
       
  }

  infoWindow(member, marker)
  {

    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
           
      let htmlInfoWindow     = new HtmlInfoWindow();
      let frame: HTMLElement = document.createElement('div');

      frame.innerHTML = ['<ion-content class="grid-basic-page cf">',
                          '<ion-grid>',
                            '<ion-row>',
                            '<ion-col>',
                               '<p align="center"><img src="assets/img/user.png" width="120" height="120" class="map-user"></p>',
                            '</ion-col>',
                            '</ion-row>',
                            '<ion-row>',
                            '<ion-col>',
                              '<p class="black-red" align="center"><span>Display Name</span>' + member.profile.defaultID +'</p>',
                              '<p class="black-red" align="center"> <span>Channel ID </span>' + member.profile.stationID + '</p>',
                              '<p class="black-red" align="center"> <span>Latitude </span>' + member.position.latitude +'<span> Longitude </span> ' + member.position.longitude + '</p>',
                            '</ion-col>',
                          '</ion-row>',
                          '<ion-row>',
                          '<ion-col>',
                            '<p align="center"><a href="#" class="anchor e-mail">',
                                  '<img src="assets/img/map-email.png" />',
                                      + member.profile.email,
                            '</a></p>',
                            '<p align="center"><a href="#" class="anchor phone">',
                                '<img src="assets/img/map-phone.png" />',
                                + member.profile.phoneNumber,
                            '</a></p>',
                          '</ion-col>',
                          '</ion-row>' ,  
                          '</ion-grid>',
                        '</ion-content>'].join("");
    
      htmlInfoWindow.setContent(frame, {width: "280px", height: "330px"});
      htmlInfoWindow.open(marker);

    });

  }

  breadCrumbs(){
    this.groupProvider.getBreadcrumbs(this.userInfo.profile.id).subscribe(result => {
      console.log(result);  
    });
  }

  participants()
  {
    let participantsModal = this.modalCtrl.create('ParticipantsPage',{visibles:this.visibleMembers,inVisibles:this.inVisibleMembers,clues:this.clues,joinkey:this.joinkey});
    participantsModal.present();
  }

  userClues(){
      let cluesModal = this.modalCtrl.create('CluesPage',{gid : this.members});
      cluesModal.present();
  }


  allowDenyNotificationSendToAdmin() {

    this.groupProvider.allowDenySendNotification(this.search).subscribe( ( resp: any ) => {

      if(resp.status == 'success'){
        
        let allowDenySendNotificationAlert = this
        .alertController
        .create({
          message: resp.message,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]

        });

        allowDenySendNotificationAlert.present();
      }

    }); 

  }

  triggerToggle(){
    let toggleModal = this.modalCtrl.create('SearchpagetogglePage');
    toggleModal.present();
  }

}
