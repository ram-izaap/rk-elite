import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController  } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

//PROVIDERS
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { ProfileInterface,UserInterface } from '../../interfaces/user';

@IonicPage()
@Component({
  selector: 'page-update',
  templateUrl: 'update.html',
})

export class UpdatePage {
    private updateType: string;
    private profileForm;
    private changePasswordForm;
    private profileInfo: ProfileInterface;
  //  private confirm_password:string = '';
    private userInfo: UserInterface;

    constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userProvider: UserProvider,
              public alertController: AlertController,
              private viewController: ViewController,
              private formBuilder: FormBuilder
            ) {
          
        //Form
		this.profileForm = formBuilder.group({
			
			//default_id
			default_id: ["",
			  Validators.compose([
				Validators.required/* , Validators.pattern(regexPatterns.email) */
			  ])
			],

			//email
			email: [
			  '', Validators.compose([
				Validators.required
				//Validators.minLength(6)
			  ])
      ],
      
			phone_number: [
			  'PRIVATE', Validators.compose([
				Validators.required
        ])
      ] 
      
      });
     
      this.changePasswordForm = formBuilder.group({
		
        password: ["",
          Validators.compose([
          Validators.required/* , Validators.pattern(regexPatterns.email) */
          ])
        ],
  
        confirm_password: ["",
        Validators.compose([
        Validators.required/* , Validators.pattern(regexPatterns.email) */
        ])
       ]

      });

  }

  ionViewWillEnter(){
    this.updateType = this.navParams.get('updateType');
    this.userProvider.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
      console.log(userInfo);
    });
    
    if(this.userInfo){

      this.profileForm = this.formBuilder.group({
        //default_id
        default_id: [this.userInfo.profile.defaultID],
        //email
        email: [this.userInfo.profile.email],
        phone_number: [this.userInfo.profile.phoneNumber] 
        });

        this.changePasswordForm = this.formBuilder.group({
          password: [this.userInfo.profile.password],
          confirm_password: [this.userInfo.profile.password]
        });
    }

  }

  updateProfile() {
     
    //Alert pop-up if mismatch password section
    if(this.profileForm.invalid){

       let missingCredentialsAlert = this
       .alertController
       .create({
         message: "Some Inputs are missing",
         buttons: [{
           text: "Ok",
           role: 'cancel'
         }]
       });
       missingCredentialsAlert.present();
   }
   else
   {

      this.profileInfo = {
		defaultID: this.profileForm.value.default_id,
		id: this.userInfo.profile.id,
		email: this.profileForm.value.email,
		phoneNumber:this.profileForm.value.phone_number,
		type:this.userInfo.profile.type,
		stationID: this.userInfo.profile.stationID
      };

     this.userProvider.updateProfile(this.profileInfo).subscribe(resp => {
         let httpResponse: any = resp;
         
         let successMessageAlert = this.alertController.create({
           message:httpResponse.message,
           buttons:[{
                     text:'OK',
                     role:'cancel'
           }]
       });
       successMessageAlert.present(); 
         
     });
   } 
 }

  updatePassword() {
     
     //Alert pop-up if mismatch password section
     if(this.changePasswordForm.invalid){

        let missingCredentialsAlert = this
        .alertController
        .create({
          message: "Some Inputs are missing",
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

      this.profileInfo = {
		id: this.userInfo.profile.id,
		password: this.changePasswordForm.value.password
     };
      
     this.userProvider.updateProfile(this.profileInfo).subscribe(resp => {
          let httpResponse: any = resp;

          let successMessageAlert = this.alertController.create({
            message:httpResponse.message,
            buttons:[{
                      text:'OK',
                      role:'cancel'
            }]
        });
        successMessageAlert.present(); 
          
       });
    } 
  }

  
  dismiss() {
    this.viewController.dismiss();
  }
}

