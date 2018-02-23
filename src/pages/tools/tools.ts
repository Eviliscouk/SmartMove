import { Component } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';

import { InAppBrowser } from '@ionic-native/in-app-browser';


//declare var google: any;


@Component({
  selector: 'page-tools',
  templateUrl: 'tools.html'
})
export class ToolsPage {

  tools: any[] = [];

  constructor(public confData: ConferenceData, private iab: InAppBrowser) {
  }

  ionViewDidLoad() {

      this.confData.getTools().subscribe((toolsData: any) => {
        
        this.tools = toolsData;

      });

  }

  onRunTool(url: string){
    const browser = this.iab.create(url);
    browser.show();
  }
}
