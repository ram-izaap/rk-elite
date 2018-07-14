import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisiblesMembersPage } from './visibles-members';

@NgModule({
  declarations: [
    VisiblesMembersPage,
  ],
  imports: [
    IonicPageModule.forChild(VisiblesMembersPage),
  ],
})
export class VisiblesMembersPageModule {}
