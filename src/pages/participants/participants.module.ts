import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParticipantsPage } from './participants';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ParticipantsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ParticipantsPage),
  ],
})
export class ParticipantsPageModule {}
