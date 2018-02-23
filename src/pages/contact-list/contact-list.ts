import { Component } from '@angular/core';

import {
  ActionSheet,
  ActionSheetController,
  ActionSheetOptions,
  Config,
  NavController
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';

import { TaskDetailPage } from '../task-detail/task-detail';
import { ContactDetailPage } from '../contact-detail/contact-detail';

// TODO remove
export interface ActionSheetButton {
  text?: string;
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean|void;
};

@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html'
})
export class ContactListPage {
  actionSheet: ActionSheet;
  contacts: any[] = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser
  ) {}

  ionViewDidLoad() {
    this.confData.getContacts().subscribe((contacts: any[]) => {
      this.contacts = contacts;
    });
  }

  goToTaskDetail(task: any) {
    this.navCtrl.push(TaskDetailPage, { taskId: task.id });
  }

  goToContactDetail(contact: any) {
    this.navCtrl.push(ContactDetailPage, { contactId: contact.id });
  }

  goToContactTwitter(contact: any) {
    this.inAppBrowser.create(
      `https://twitter.com/${contact.twitter}`,
      '_blank'
    );
  }

  openContactShare(contact: any) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + contact.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log('Copy link clicked on https://twitter.com/' + contact.twitter);
            if ( (window as any)['cordova'] && (window as any)['cordova'].plugins.clipboard) {
              (window as any)['cordova'].plugins.clipboard.copy(
                'https://twitter.com/' + contact.twitter
              );
            }
          }
        } as ActionSheetButton,
        {
          text: 'Share via ...'
        } as ActionSheetButton,
        {
          text: 'Cancel',
          role: 'cancel'
        } as ActionSheetButton
      ]
    } as ActionSheetOptions);

    actionSheet.present();
  }

  openContactInfo(contact: any) {
    let mode = this.config.get('mode');

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contact ' + contact.name,
      buttons: [
        {
          text: `Email ( ${contact.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + contact.email);
          }
        } as ActionSheetButton,
        {
          text: `Call ( ${contact.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + contact.phone);
          }
        } as ActionSheetButton
      ]
    } as ActionSheetOptions);

    actionSheet.present();
  }
}
