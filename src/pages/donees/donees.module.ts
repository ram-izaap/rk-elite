import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoneesPage } from './donees';

@NgModule({
  declarations: [
    DoneesPage,
  ],
  imports: [
    IonicPageModule.forChild(DoneesPage),
  ],
})
export class DoneesPageModule {}
