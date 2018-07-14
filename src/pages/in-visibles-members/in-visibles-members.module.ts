import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InVisiblesMembersPage } from './in-visibles-members';

@NgModule({
  declarations: [
    InVisiblesMembersPage,
  ],
  imports: [
    IonicPageModule.forChild(InVisiblesMembersPage),
  ],
})
export class InVisiblesMembersPageModule {}
