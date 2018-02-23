import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NavParams, ToastController, NavController } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-task-edit',
  templateUrl: 'task-edit.html'
})
export class TaskEditPage implements OnInit{
  mode = 'New';
  taskForm: FormGroup;
  task: any;
  taskGroupTitle: any;

  constructor(
    public dataProvider: ConferenceData,
    private navParams: NavParams,
              private toastCtrl: ToastController,
              private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    this.taskGroupTitle = this.navParams.get('groupTitle');
    if (this.mode == 'Edit') {
      this.task = this.navParams.get('task');
    }
    
    this.initializeForm();
  }

  private initializeForm() {
    let name = null;
    let description = null;
    let location = null;
    
    if (this.mode == 'Edit') {
      name = this.task.name;
      description = this.task.description;
      location = this.task.location;
    }

    this.taskForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'description': new FormControl(description, Validators.required),
      'location': new FormControl(location, Validators.required),
    });
  }

  onSubmit() {
    const value = this.taskForm.value;
    if (!this.task)
      this.task = {};

    this.task.name = value.name;
    this.task.description = value.description;
    this.task.location = value.location;

    if (this.mode == 'Edit') {
      this.dataProvider.updateTask(this.task).then(() => {
       
        const toast = this.toastCtrl.create({
          message: 'Task Updated!',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
        
      })
      .catch(err =>{
        const toast = this.toastCtrl.create({
          message: err,
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
      });
      
    } else {
      this.dataProvider.addTask(this.task, this.taskGroupTitle).then(() => {
       
        const toast = this.toastCtrl.create({
          message: 'Task Added!',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
        
      })
      .catch(err =>{
        const toast = this.toastCtrl.create({
          message: err,
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
      });
    }
    this.taskForm.reset();
    this.navCtrl.popToRoot();
  }
}
