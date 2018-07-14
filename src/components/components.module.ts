import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import {CommonModule} from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { ParticipantsListComponent } from './participants-list/participants-list';

@NgModule({
	declarations: [ParticipantsListComponent],
	imports: [CommonModule, IonicModule],
	exports: [ParticipantsListComponent],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	  ]
})
export class ComponentsModule {}
