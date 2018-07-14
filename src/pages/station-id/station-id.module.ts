import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationIdPage } from './station-id';

@NgModule({
  declarations: [
    StationIdPage,
  ],
  imports: [
    IonicPageModule.forChild(StationIdPage),
  ],
})
export class StationIdPageModule {}
