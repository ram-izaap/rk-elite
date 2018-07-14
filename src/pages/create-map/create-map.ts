import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ViewController,MenuController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
//import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserInterface, GroupInterface } from '../../interfaces/user';

@IonicPage()
@Component({
  selector: 'page-create-map',
  templateUrl: 'create-map.html',
})
export class CreateMapPage {
  private mapForm;
  private group: GroupInterface;
  private groupInfo: GroupInterface;
  private userInfo: UserInterface;
  private pageType: string = 'create';
  location : boolean = false;
  password : boolean = false;
  public types : any;
  public locationType : any;
  public protectionType : any;

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              private _formBuilder: FormBuilder,
              private groupProvider: GroupProvider,
              private alertController: AlertController,
             // private toastCtrl: ToastController,
              private userProvider: UserProvider,
              private viewController: ViewController,
              //private nativeGeocoder: NativeGeocoder,
              public menuCtrl: MenuController
            ) {

        //Form
		this.mapForm = _formBuilder.group({
			
			//displayname
			display_name: ["",
			  Validators.compose([
				Validators.required/* , Validators.pattern(regexPatterns.email) */
			  ])
			],

			//join_key
			join_key: [
			  '', Validators.compose([
				Validators.required
				//Validators.minLength(6)
			  ])
      ],

      // permanent: [
			//   '', Validators.compose([
			//   ])
      // ],

      // temporary: [
			//   '', Validators.compose([
			//   ])
      // ],

      type: [
			  'PRIVATE', Validators.compose([
			  ])
      ],

      address: [
			  '', Validators.compose([
			  ])
      ],

      protectionType: [
			  '', Validators.compose([
			  ])
      ],

      password: [
			  '', Validators.compose([
			  ])
      ],

      latitude: [
			  '', Validators.compose([
			  ])
      ],

      longitude: [
			  '', Validators.compose([
			  ])
      ],

      // allow_deny: [
			//   '', Validators.compose([
			//   ])
      // ],

      // no_map: [
			//   '', Validators.compose([
			//   ])
      // ],

      // password_value: [
			//   '', Validators.compose([
			//   ])
      // ],





      
      //type
			// type: [
			//   'PRIVATE', Validators.compose([
			// 	Validators.required
      //   ])
      // ] 

      // location_type:[
			//   'PUBLIC', Validators.compose([
			// 	Validators.required
      //   ])
      // ],
      
      // protection_type:[
      //   'NORMAL',
      //   Validators.compose([
      //     Validators.required
      //   ])
      // ]
      
      });     
    
  }
  
  dismiss() {

       this.viewController.dismiss();
  } 
  ionViewWillEnter(){
   // this.menuCtrl.open();
  
    this.groupInfo= this.navParams.get('group');
    this.pageType = this.navParams.get('pageType');
    //console.log(this.groupInfo);
    this.userProvider.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    console.log(this.groupInfo);
    
    if(this.groupInfo && this.pageType == 'create'){

      if(this.groupInfo.type =='PUBLIC'){
         this.location = true;
       }

       if(this.groupInfo.protectionType =='PASSWORD'){
         this.password = true; 
       }

        this.mapForm = this._formBuilder.group({ 
          display_name:[this.groupInfo.name],
          join_key:[this.groupInfo.joinKey],
          type:[this.groupInfo.type],
          protectionType:[this.groupInfo.protectionType],
          latitude:[this.groupInfo.latitude],
          longitude:[this.groupInfo.longitude],
          password:['']
        });     
    }

  }

  createMap(){

    console.log('testing');

    if (this.mapForm.invalid) {

      //Alert pop-up
      let missingCredentialsAlert = this
      .alertController
      .create({
        message: "Some inputs are missing",
        buttons: [
                    {
                      text: "Ok",
                      role: 'cancel'
                    }
                ]
      });

      missingCredentialsAlert.present();

    }
    else
    {
     this.doCreateMap();
    }   
  } 

  doCreateMap(){

      if(this.mapForm.value.type == 'PRIVATE'){
        this.types = 'PRIVATE';
        this.locationType = 'DYNAMIC';
      }

      if(this.mapForm.value.type == 'PUBLIC'){
        this.types = 'PUBLIC';
        this.locationType = 'STATIC';
      }

      if(this.mapForm.value.protectionType == 'PASSWORD'){
        this.protectionType = 'PASSWORD';
      }

      if(this.mapForm.value.protectionType == 'REQUEST'){
        this.protectionType = 'REQUEST';
      }

      if(this.mapForm.value.protectionType == 'NORMAL'){
        this.protectionType = 'NORMAL';
      }




    let editID: number = 0;
    if(this.groupInfo){editID = this.groupInfo.id;}
   
    this.group = {
                    id: editID,
                    userId: this.userInfo.profile.id,
                    type:  this.types,
                    password: this.mapForm.value.password,
                    protectionType: this.protectionType,
                    locationType: this.locationType,
                    createdID: this.userInfo.profile.id,
                    updatedID: this.userInfo.profile.id,
                    name: this.mapForm.value.display_name,
                    joinKey: this.mapForm.value.join_key,
                    createdDate:'',
                    updatedDate:'',
                    latitude:this.mapForm.value.latitude,
                    longitude:this.mapForm.value.longitude
     };

      // if(editID){
      //   this.group.id             = editID;
      //   this.group.type           = this.types;
      //   this.group.protectionType = this.protectionType;
      //   this.group.locationType   = this.locationType;
      // }

      console.log(this.group);
    
     this.groupProvider.group(this.group,this.pageType).subscribe(resp => {

        let httpResponse: any = resp;
        
        console.log(httpResponse);

        if(httpResponse.status == 'success'){ 
           
            let successMessageAlert = this.alertController.create({
              message:httpResponse.message,
              buttons:[{
                        text:'OK',
                        role:'cancel'
              }]
    
            });
            successMessageAlert.present();
            this.dismiss(); 
           // this.navCtrl.setRoot("MapsPage");
        }  

     }); 
}


goBack(){
    this.navCtrl.push('MapsPage');
}


type(type){
    if(type == 'PUBLIC'){
        this.location = true;
    }

    if(type == 'PRIVATE'){
      this.location = false;
    }
    
}

protection_type(type){
    if(type == 'PASSWORD'){
        this.password = true; 
    }

    if(type == 'REQUEST'){
      this.password = false;
    }

    if(type == 'NORMAL'){
      this.password = false;
    }
}

// showLocation(){
//     //alert(this.mapForm.value.address);
//     this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818)
//   .then((result: NativeGeocoderReverseResult) => console.log(JSON.stringify(result)))
//   .catch((error: any) => console.log(error));

// this.nativeGeocoder.forwardGeocode('gunidy')
//   .then((coordinates: NativeGeocoderForwardResult) => console.log('The coordinates are latitude=' + coordinates.latitude + ' and longitude=' + coordinates.longitude))
//   .catch((error: any) => console.log(error));
// }


}
