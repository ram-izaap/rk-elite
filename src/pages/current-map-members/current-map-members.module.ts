import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { CurrentMapMembersPage } from './current-map-members';

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    CurrentMapMembersPage
  ],
  imports: [
    ComponentsModule,
    DirectivesModule,
    IonicPageModule.forChild(CurrentMapMembersPage),
  ],
})
export class CurrentMapMembersPageModule {}
