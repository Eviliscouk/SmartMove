import { ToolsPage } from '../tools/tools';
import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { AboutPage } from '../about/about';
//import { MapPage } from '../map/map';
import { TaskListPage } from '../task-list/task-list';
import { ContactListPage } from '../contact-list/contact-list';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = TaskListPage;
  tab2Root: any = ContactListPage;
  tab3Root: any = ToolsPage;
  tab4Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
