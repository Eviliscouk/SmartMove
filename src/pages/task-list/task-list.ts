import { Component, ViewChild } from '@angular/core';

import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

import { TaskDetailPage } from '../task-detail/task-detail';
import { TaskFilterPage } from '../task-filter/task-filter';
import { TaskEditPage } from '../task-edit/task-edit';


@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html'
})
export class TaskListPage {
  // the list is a child of the task-list page
  // @ViewChild('taskList') gets a reference to the list
  // with the variable #taskList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('taskList', { read: List }) taskList: List;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownTasks: any = [];
  groups: any = [];
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public confData: ConferenceData,
    public user: UserData,
  ) {}

  ionViewDidLoad() {
    this.app.setTitle('Task List');
    this.updateTaskList();
  }

  updateTaskList() {
    // Close any open sliding items when the task list updates
    this.taskList && this.taskList.closeSlidingItems();

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownTasks = data.shownTasks;
      this.groups = data.groups;
    });
  }

  onAddTask(groupTitle: string)
  {
    this.navCtrl.push(TaskEditPage, {mode: 'New', groupTitle: groupTitle});
  }

  presentFilter() {
    let modal = this.modalCtrl.create(TaskFilterPage, this.excludeTracks);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        this.excludeTracks = data;
        this.updateTaskList();
      }
    });

  }

  goToTaskDetail(taskData: any) {
    // go to the task detail page
    // and pass in the task data

    this.navCtrl.push(TaskDetailPage, { taskId: taskData.id, name: taskData.name });
  }

  addQuickView(slidingItem: ItemSliding, taskData: any) {

    if (this.user.hasQuickView(taskData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeQuickView(slidingItem, taskData, 'Task already added');
    } else {
      // remember this task as a user favorite
      this.user.addQuickView(taskData.name);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Task Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeQuickView(slidingItem: ItemSliding, taskData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this task from your Quick View?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the task
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this task from their favorites
            this.user.removeQuickView(taskData.name);
            this.updateTaskList();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  openSocial(network: string, fab: FabContainer) {
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }

  doRefresh(refresher: Refresher) {
    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownTasks = data.shownTasks;
      this.groups = data.groups;

      // simulate a network request that would take longer
      // than just pulling from out local json file
      setTimeout(() => {
        refresher.complete();

        const toast = this.toastCtrl.create({
          message: 'Tasks have been updated.',
          duration: 3000
        });
        toast.present();
      }, 1000);
    });
  }
}
