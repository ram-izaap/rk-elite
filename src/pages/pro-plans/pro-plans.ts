import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams,ModalController} from 'ionic-angular';

//PROVIDERS
import { GroupProvider } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';

//INTERFACES
import { UserInterface} from '../../interfaces/user';	

/**
 * Generated class for the ProPlansPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pro-plans',
  templateUrl: 'pro-plans.html',
})
export class ProPlansPage {
  private userInfo: UserInterface;
  public plans : any;
  public userplan : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private user:UserProvider,
		private modalCtrl:ModalController, private viewController: ViewController) {
            
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ProPlansPage');
  // }
  
  ionViewWillEnter(){
    console.log('ionViewWillEnter ProPlansPage');
    this.selectPlan();
  }

  dismiss(){
    this.viewController.dismiss();
  }
      


    selectPlan(){
      this.user.planSelect().subscribe(result => {
        let httpResponse: any = result;
        this.plans = httpResponse.plans;
        //console.log(this.plans);
        });
       
        this.user.userInfo$.subscribe(userInfo => {
					this.userInfo = userInfo;
      });
      this.user.userPlanSelect(this.userInfo.profile.id).subscribe(result =>{
         let httpResponse: any = result;
         this.userplan = httpResponse.userplan.plan_id;
      });
    } 

    update(planid:any,price:any){
					let couponsModal = this.modalCtrl.create('CouponsPage',{planid : planid,price:price});
           couponsModal.present();
           couponsModal.onDidDismiss(resp => {
             console.log("nnnnnnnn");
             this.ionViewWillEnter();
           });					
    }

}
