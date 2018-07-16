import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberRegistrationPage } from './member-registration';

@NgModule({
  declarations: [
    MemberRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberRegistrationPage),
  ],
})
export class MemberRegistrationPageModule {}
