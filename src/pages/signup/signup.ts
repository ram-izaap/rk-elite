import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
//import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";

//PROVIDERS
import { UserProvider } from '../../providers/user/user';
import { GroupProvider } from '../../providers/group/group';

//INTERFACES
import { SignUpOptions,UserOptions,positionOptions, GroupInterface } from '../../interfaces/user';
//import { GroupOptions } from '../../interfaces/group';

//PLUGINS


/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  
  private _signUpForm: FormGroup;
  private _guestForm: FormGroup;
  //private passwordInputType: string = "password";
  public signup: SignUpOptions = {email:'', password:'', default_id:'', phone_number:'',type:'USER'};
  public position: positionOptions = {latitude:0, longitude: 0, bearing:0, accuracy:0, altitude:0,userId:"",speed:0,type:"position"};
  public  group: GroupInterface;
                                 
  public submitted:boolean;
  public loginParams: UserOptions = { username: '', password: '' };
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userProvider: UserProvider,
    private alertController: AlertController,
    private groupProvider: GroupProvider,
    private _formBuilder: FormBuilder,
  //  private toastCtrl: ToastController,
    private geolocation: Geolocation
  ) {
    
    //Guest Registeration
    this._guestForm = this._formBuilder.group({
        guest_id: ["",
          Validators.compose([
          Validators.required
          ])
        ]
    });

    //Form
		this._signUpForm = _formBuilder.group({
        //Default ID
        default_id: ["",
          Validators.compose([
          Validators.required
          ])
        ],

        phone_number: ["",
          Validators.compose([
          Validators.required,
          Validators.minLength(10)
          ])
        ],

        email: ["",
          Validators.compose([
          Validators.required/* , Validators.pattern(regexPatterns.email) */
          ])
        ],
        //PASSWORD
        password: [
          '', Validators.compose([
          // ,Validators.pattern(regexPatterns.password),
          Validators.required,
          Validators.minLength(6)
          ])
        ]
      }); 
    
  }
 

   register(){

    if (this._signUpForm.invalid) {
              //Alert pop-up
              let missingCredentialsAlert = this
              .alertController
              .create({
                message: "Some credentials are missing",
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

        this.signup.default_id   = this._signUpForm.value.default_id; 
        this.signup.phone_number = this._signUpForm.value.phone_number; 
        this.signup.email        = this._signUpForm.value.email; 
        this.signup.password     = this._signUpForm.value.password;
        this.doRegister();

    }   
  
  }

  guest(){
            if (this._guestForm.invalid) {
                  //Alert pop-up
                  let missingCredentialsAlert = this
                  .alertController
                  .create({
                    message: "Guest Id missing",
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
              this.signup.default_id   = this._guestForm.value.guest_id; 
              this.signup.phone_number = this._guestForm.value.guest_id; 
              this.signup.type         = 'GUEST'; 
              this.signup.email        =  ''; 
              this.signup.password     =  '';
              this.doRegister();
            }
  }
  
  
  doRegister(){

 //console.log(this.signup);
        this.userProvider.signup(this.signup).subscribe(resp => {

            let httpResponse: any   = resp;

            let successMessageAlert = this.alertController.create({
                                              message:httpResponse.message,
                                              buttons:[{
                                                        text:'OK',
                                                        role:'cancel'
                                              }]
                                          });
                successMessageAlert.present(); 

              if(httpResponse.status == 'success'){
                
                this.getCurrentPosition(httpResponse.user_id);

                //create groups default id & phonenumber
                this.group = {
                               id: 0,
                               userId  : httpResponse.user_id,
                               type    : 'PRIVATE',
                               password: '',
                               protectionType: 'NORMAL',
                               latitude:'',
                               longitude:'',
                               locationType:'DYNAMIC',
                               createdID: httpResponse.user_id,
                               updatedID: httpResponse.user_id,
                               name: this.signup.default_id,
                               joinKey: this.signup.default_id,
                               createdDate: '',
                               updatedDate:''                               
                };
                
                let defaultIdGroupCreate   = this.groupProvider.group(this.group,'create');
                
                if( this.signup.phone_number !== this.signup.default_id){

                  this.group = {
                                id: 0,
                                userId  : httpResponse.user_id,
                                type    : 'PRIVATE',
                                password: '',
                                protectionType: 'NORMAL',
                                latitude:'',
                                longitude:'',
                                locationType:'DYNAMIC',
                                createdID: httpResponse.user_id,
                                updatedID: httpResponse.user_id,
                                name: this.signup.phone_number,
                                joinKey: this.signup.phone_number,
                                createdDate: '',
                                updatedDate:''                               
                  };
                  let phonenumberGroupCreate = this.groupProvider.group(this.group,'create');

                    forkJoin([defaultIdGroupCreate, phonenumberGroupCreate]).subscribe(results => {
                      let httpResponse:any = results;
                      if(httpResponse[0].status == 'success' && httpResponse[1].status == 'success'){
                          this.loginParams.username = this.signup.email;
                          this.loginParams.password = this.signup.password;
                          this.userProvider.login(this.loginParams).subscribe(resp => {
                            console.log(resp);
                          });
                        }
                    });
                    
                }
                else
                {
                  this.groupProvider.group(this.group,'create').subscribe(resp => {
                    console.log(resp);
                     let httpResponse: any = resp;
                     if(httpResponse.status == 'success'){
                      this.loginParams.username = this.signup.default_id;
                      this.loginParams.password = '';
                      this.userProvider.login(this.loginParams).subscribe(result => {
                        console.log(result);
                      });
                     }
                  });
                }
          }

          else{
                              //throw error
                        let missingCredentialsAlert = this
                        .alertController
                        .create({
                          message: httpResponse.message,
                          buttons: [
                            {
                            text: "Ok",
                            role: 'cancel'
                            }
                          ]
                        });
              missingCredentialsAlert.present();
          }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  login(){
    this.navCtrl.push('LoginPage');
  }

  getCurrentPosition(user_id){
    //console.log(user_id);
     // get current position
      this.geolocation.getCurrentPosition().then(pos => {
        console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);

        let httpResponse = pos;
        this.position.userId      = user_id;
        this.position.latitude    = httpResponse.coords.latitude;
        this.position.longitude   = httpResponse.coords.longitude;
        this.position.speed       = httpResponse.coords.speed;
        this.position.altitude    = httpResponse.coords.altitude;
      //  this.position.bearing     = httpResponse.coords.bearing;
        this.position.bearing     = 0;
        this.position.accuracy    = httpResponse.coords.accuracy;
        this.position.type        = this.position.type;

          this.userProvider.position(this.position).subscribe(resp => {
            console.log(resp);
          });
      });

      // const watch = this.geolocation.watchPosition().subscribe(pos => {
      //   console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      // });

      // to stop watching
      //watch.unsubscribe();
  }
}
