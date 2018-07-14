import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CluesPage } from './clues';

@NgModule({
  declarations: [
    CluesPage,
  ],
  imports: [
    IonicPageModule.forChild(CluesPage),
  ],
})
export class CluesPageModule {}
