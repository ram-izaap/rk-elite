import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//PLUGINS
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//PROVIDERS
import { UserProvider } from '../providers/user/user';
import { GroupProvider } from '../providers/group/group';


//INTERFACES
import { UserOptions, 
	SignUpOptions, 
	//profileOptions, 
	positionOptions,
	UserInterface,
	ProfileInterface,
	MemberInterface,
	updateDeviceToken
//	GroupInterface
 } from '../interfaces/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //Default root page
  //public rootPage: any = 'LoginPage';
    public rootPage: any = 'LoginPage';  
	public pages: Array<{title: string, component: string}>;
	private deviceToken: string;
	private userInfo: any;
	private position: positionOptions;

  constructor(  public platform: Platform, 
				public statusBar: StatusBar, 
				public splashScreen: SplashScreen,
				private userProvider: UserProvider,
				private groupProvider: GroupProvider,
				private ionicStorage: Storage,
				private loadingController: LoadingController,
				private menuController: MenuController,
				private alertController: AlertController
			) {
	
	// if user enters from login/signup/app in background
	this.userProvider.authStatus$.subscribe(authStatus => {

		if(authStatus === true) {
			this.menuController.enable(true);
			this.nav.setRoot("HomePage");
		}

	});	

	this
		.ionicStorage
		.ready()
		.then(() => {
			//Now validate User
			this
				.userProvider
				.validateUser()
				.then(savedUserInfo => {
					if(null === savedUserInfo){
						this.nav.setRoot("LoginPage");						
					}
					else
					{
						this.userProvider.userInfoSource.next(savedUserInfo);
						this.userProvider.updateAuthStatus(true);
					}
				});
		});
	
    // used for an example of ngFor and navigation
    this.pages = [
			{ title: 'Home', component: 'HomePage' },
			{ title: 'Members Registration', component: 'MemberRegistrationPage' },
			{ title: 'Your Donations', component: 'StationIdPage'},
			{ title: 'Donate', component: 'SearchPage' },
			{ title: 'Maps', component: 'MapsPage' },
			{ title: 'View My Current Map Members', component: 'CurrentMapMembersPage' },
			{ title: 'Saved Maps', component: 'SavedMapsPage'},
			{ title: 'Notification', component: 'NotificationPage'},
			{ title: 'Pro Plans', component: 'ProPlansPage'},
			{ title: 'Help', component: 'HelpPage'}
		];
		
	this.platformReady();


	this.userProvider.userInfo$.subscribe(userInfo => {
		this.userInfo = userInfo;
		console.log(userInfo);
	});
	

	//this.backgroundGeolocation.start();
	//this.backgroundGeolocation.stop();

  }

  private platformReady(): void {

    this.platform.ready().then(() => {
		this.statusBar.styleDefault();
		this.splashScreen.hide();	
	});
	

  }

  
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  updateUserDeviceToken(){
		 
		this
		.userProvider
		.updateUserDeviceToken(this.userInfo.profile.id,this.deviceToken)
		.subscribe( ( resp:any ) => {
			 
		}); 

	}
	   
 logout(): void{

	let logoutLoading = this
      .loadingController
      .create({ content: "Goodbye ..." });
	logoutLoading.present();
	
	setTimeout(() => {
		this
		  .userProvider
		  .logout()
		  .then(() => {
			this
			  .menuController
			  .enable(false);
			
			this.nav.setRoot("LoginPage").then(() => {
			     // this.userProvider.userInfoSource.next(null);
					//	this.userProvider.updateAuthStatus(false);
			});
  
		  });
		logoutLoading.dismiss();
	  }, 2000);
	}
	
	clearCluesandMembers(){
		
		let alert = this.alertController.create();

		alert.setTitle('Exit/Clear MAP');
		alert.addInput({
			type: 'radio',
			label: 'Remove yourself from map and return to home page',
			value: 'one'		
		});
		alert.addInput({
			type: 'radio',
			label: 'Remove yourself from all Maps. Turn off your tracking',
			value: 'all'
		});
		alert.addInput({
			type: 'radio',
			label: 'Clear All Members',
			value: 'allmembers'
		});
		alert.addInput({
			type: 'radio',
			label: 'Clear All Clues',
			value: 'allclues'
		});
		alert.addInput({
			type: 'radio',
			label: 'Clear Both Clues and Members',
			value: 'both'
		});

		alert.addButton('Cancel');
		alert.addButton({
			text: 'OK',
			handler: data => {
				console.log(data);
				this.userProvider.userInfo$.subscribe(userInfo => {
					let exitMaps = {
							userId:	userInfo.profile.id,
							joinKey: userInfo.group.joinKey,
							type:data
					}
					console.log(exitMaps);
					this.groupProvider.removeMembers(exitMaps).subscribe(resp => {

					});
				});
			}
		});
		alert.present();
	}
}
