import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams,ViewController,AlertController, ToastController } from 'ionic-angular';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserInterface} from '../../interfaces/user';	
/**
 * Generated class for the CouponsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coupons',
  templateUrl: 'coupons.html',
})
export class CouponsPage {
  private userInfo: UserInterface;
  private coupons_form: FormGroup;
  public planid : any;
  
  public promocode : any;
  public plans : any;
  public discount : any;
  public price : any;
  public benefit : any;
  public deductions : any = '0';
  public grandtotal : any;
  private applyButton : boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewController: ViewController, private formBuilder: FormBuilder,
    private alertController: AlertController,private user:UserProvider,private toastCtrl: ToastController) {
				this.user.userInfo$.subscribe(userInfo => {
					this.userInfo = userInfo;
			});
			this.coupons_form = this.formBuilder.group({
						promocode : ["",
						Validators.compose([
						Validators.required
						])
					]
			});
			this.planid 	= this.navParams.get('planid');
			this.price  	= this.navParams.get('price');
			this.grandtotal = this.price - this.deductions;
			
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CouponsPage');
  }

    dismiss(){
        this.viewController.dismiss();
    }

			apply(){
				this.applyButton = true;
				if (this.coupons_form.invalid) {
					return;
				  }
				
					this.promocode = this.coupons_form.value.promocode;
					//console.log(this.promocode);
						this.user.planUpdate(this.promocode,this.planid).subscribe(resp => {
											console.log(resp);
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
									else{
													this.discount = httpResponse.promo_code.discount_type;
													this.price =  httpResponse.plans.price;
													this.benefit = httpResponse.promo_code.benefit_amt;
													if(httpResponse.promo_code.discount_type=='flat'){
														this.deductions = httpResponse.plans.price - httpResponse.promo_code.benefit_amt;
														this.grandtotal = httpResponse.plans.price - this.deductions;
													}
													else
													{
														this.deductions = (httpResponse.promo_code.benefit_amt / 100) * httpResponse.plans.price;
														this.grandtotal = httpResponse.plans.price - this.deductions; 
													}
										}
												
						});
			
					 			
			}

		proceed(){
						this.user.planUpdateUser(this.planid,this.userInfo.profile.id).subscribe(result => {
						let httpResponse: any = result;
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
						else{
							let toast = this.toastCtrl.create({
													message: httpResponse.message,
													duration: 3000,
													position: 'top',
													cssClass: 'dark-trans',
													closeButtonText: 'OK',
													showCloseButton: true
												});
									toast.present();
									
									//this.navCtrl.setRoot('ProPlansPage');
									this.dismiss();
						}
				});
				//this.dismiss();
		}	

}
