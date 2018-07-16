import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,AlertController, ToastController,ModalController } from 'ionic-angular';
//import { NgForm } from '@angular/forms';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserInterface, 
	//	 GroupInterface, 
	//	 ProfileInterface, 
		 MemberInterface, 
		 SearchInterFace
		} from '../../interfaces/user';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

	private _memberParams = { title: "Members" };
  	private _donationParams = { title: "Donations" };
  	private _doneeParams = { title: "Donees" };

	private search_form: FormGroup;
	public joinkey : any;
	private userInfo: UserInterface;
	private members: Array<MemberInterface> = [];
	private search: SearchInterFace;

	constructor(public navCtrl: NavController, 
			public navParams: NavParams,
			private userProvider: UserProvider,
			private groupProvider: GroupProvider,
			private alertController: AlertController,
			private toastCtrl: ToastController,
			private formBuilder: FormBuilder,
			private modalCtrl:ModalController	
	) {
		  
		this.search_form = this.formBuilder.group({
			joinkey : ["",
			Validators.compose([
			Validators.required
			])
		   ]
       });

	}

	ionViewWillEnter(){
		this.userProvider.userInfo$.subscribe(userInfo => {
			this.userInfo = userInfo;
			console.log(userInfo);
		});

		//this.viewMyMap();
	}

	goToPage(page: string) {
		if (page) {
			this.navCtrl.push(page);
		}		
	}

	viewMyMap(){

		this.search = {
			user_id: this.userInfo.profile.id,
			joinKey: this.userInfo.group.joinKey
		};

		this.groupProvider.getMembersByGroup(this.search).subscribe(mappedMembers => {
			this.members = mappedMembers;  
			 this.joinkey =  this.members[0].profile.stationID;   
			//console.log(this.joinkey);
			this.navCtrl.setRoot('SearchPage', {joinkey: this.joinkey});
		  });
	}
	
	exitAllMaps() {

		this.search = {
			user_id: this.userInfo.profile.id,
			joinKey: ''
		};

		this.groupProvider.removeMembersByUserID(this.search).subscribe(resp => {
			let httpResponse: any = resp;      
			//console.log('Exit All Maps', httpResponse);
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
				this.presentToast(httpResponse.message);
			}
		});

	}

	private presentToast(msg){
			let toast = this.toastCtrl.create({
				message: msg,
				duration: 3000,
				position: 'top',
				cssClass: 'dark-trans',
				closeButtonText: 'OK',
				showCloseButton: true
			});
	    toast.present();
	}

}
