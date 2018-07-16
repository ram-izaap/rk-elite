import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-member-registration',
  templateUrl: 'member-registration.html',
})
export class MemberRegistrationPage {
  private _signupForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, private _formBuilder: FormBuilder) {

    this._signupForm = _formBuilder.group({
      first_name: [
        '', Validators.compose([
          Validators.required, Validators.minLength(3),
          // Validators.pattern(regexPatterns.nameStrings)
        ])
      ],
      last_name: [
        '', Validators.compose([
          Validators.required, Validators.minLength(3),
          // Validators.pattern(regexPatterns.nameStrings)
        ])
      ],
      sex: [
        "M", Validators.compose([
          Validators.required
        ])
      ],      
      phone: [
        '', Validators.compose([
          Validators.minLength(10)
        ])
      ],
      email: [
        "", Validators.compose([
          Validators.required
        ])
      ],
      education: [
        '', Validators.compose([])
      ],
      occupation_type: [
        '', Validators.compose([])
      ], 
      occupation_details: [
        '', Validators.compose([])
      ],      
    }); //end this._signupForm
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberRegistrationPage');
  }

}
