import { NgModule } from '@angular/core';
import { ScrollableTabsDirective } from './scrollable-tabs/scrollable-tabs';
import { TabsDirective } from './tabs/tabs';
@NgModule({
	declarations: [ScrollableTabsDirective,
    TabsDirective],
	imports: [],
	exports: [ScrollableTabsDirective,
    TabsDirective]
})
export class DirectivesModule {}
