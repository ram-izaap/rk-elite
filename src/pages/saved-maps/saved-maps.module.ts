import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedMapsPage } from './saved-maps';

@NgModule({
  declarations: [
    SavedMapsPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedMapsPage),
  ],
})
export class SavedMapsPageModule {}
