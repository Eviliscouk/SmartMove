import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';
import { TaskEditPage } from '../task-edit/task-edit';

@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html'
})
export class TaskDetailPage {
  task: any;
  groupTitle: any;

  constructor(
    public dataProvider: ConferenceData,
    public navParams: NavParams,
    public navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    this.dataProvider.load().subscribe((data: any) => {
      if (
        data &&
        data.taskList &&
        data.taskList[0] &&
        data.taskList[0].groups
      ) {
        for (const group of data.taskList[0].groups) {
          if (group && group.tasks) {
            for (const task of group.tasks) {
              if (task && task.id === this.navParams.data.taskId) {
                this.task = task;
                this.groupTitle = group.title;
                break;
              }
            }
          }
        }
      }
    });
  }

  onEditTask() {
    this.navCtrl.push(TaskEditPage, {mode: 'Edit', task: this.task, groupTitle: this.groupTitle});
  }
}
