import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail.html'
})
export class ContactDetailPage {
  contact: any;

  constructor(public dataProvider: ConferenceData, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.dataProvider.load().subscribe((data: any) => {
      if (data && data.contacts) {
        for (const contact of data.contacts) {
          if (contact && contact.id === this.navParams.data.contactId) {
            this.contact = contact;
            break;
          }
        }
      }
    });

  }

  goToTaskDetail(task: any) {
    this.navCtrl.push('TaskDetailPage', { taskId: task.id });
  }
}
