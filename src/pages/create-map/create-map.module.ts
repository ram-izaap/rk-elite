import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMapPage } from './create-map';

@NgModule({
  declarations: [
    CreateMapPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateMapPage),
  ],
})
export class CreateMapPageModule {}
