import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//rxjs
//import { Observable } from 'rxjs/Observable';
//import { BehaviorSubject } from 'rxjs/BehaviorSubject';


//PROVIDERS
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserOptions } from '../../interfaces/user';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
	
	public loginParams: UserOptions = { username: '', password: '' };
	public submitted = false;
	private loginForm: FormGroup;
	private passwordInputType: string = "password"; //used for show/hide password
	
	
	
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		private _formBuilder: FormBuilder,
		private userProvider: UserProvider,
		private alertController: AlertController,
		private toastCtrl: ToastController
	) {	

		//Form
		this.loginForm = this._formBuilder.group({
			
			//EMAIL
			email: ["nirmal@gmail.com",
			  Validators.compose([
				Validators.required/* , Validators.pattern(regexPatterns.email) */
			  ])
			],

			//PASSWORD
			password: [
			  '123456', Validators.compose([
				Validators.required,
				Validators.minLength(6)
			  ])
			]

		  }); //end this.loginForm

	}

	 login(){

		if (this.loginForm.invalid) {
			
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
		else{

			//Prepare login params
			this.loginParams.username = this.loginForm.value.email;
			this.loginParams.password = this.loginForm.value.password;
			
      console.log(this.loginParams);
			//check if valid user
			this.userProvider.login(this.loginParams).subscribe(resp => {
				console.log("Login: "+resp);
				let httpResponse: any = resp;
				if(httpResponse.status == 'error'){

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
				else
				{
					//redirect to HomePage
					//this.navCtrl.setRoot('HomePage');
				}
			});
		}
	}
	
	/**
	 * 
	 * @param event 
	 * It shows/hides password
	 */
 toggleViewPassword(event: MouseEvent) {
		event.preventDefault();
		console.info("show password");
		if (this.passwordInputType === "password") {
		  this.passwordInputType = "text";
		} else {
		  this.passwordInputType = "password";
		};
	}; //end _toggleViewPassword

	/**
	 * it redirects to Signup Page
	 */
	signup() {
		this.navCtrl.push('SignupPage');
	}
	
	forgotPass() {

		//Prepare alert controller
		let forgot = this.alertController.create({
		  title: 'Forgot Password?',
		  message: "Enter you email address to send a reset link password.",
		  inputs: [
			{
			  name: 'email',
			  placeholder: 'Email',
			  type: 'email'
			},
		  ],
		  buttons: [
			{
			  text: 'Cancel',
			  handler: data => {
				console.log('Cancel clicked');
			  }
			},
			{
			  text: 'Send',
			  handler: data => {
				
				//
			    this.userProvider.forgotPassword(data.email).subscribe(resp => {
					
					let httpResponse: any = resp;
					if(httpResponse.status == 'error'){
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
					else
					{
						let toast = this.toastCtrl.create({
										message: 'Email has been sent please check inbox or spam folder.',
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
			}
		  ]
		});
		forgot.present();
	  }

}


