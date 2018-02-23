import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class ConferenceData {
  data: any;

  constructor(public http: Http, public user: UserData) { }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/data.json')
        .map(this.processData, this);
    }
  }

  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking contacts to tasks
    this.data = data.json();

    this.data.tracks = [];

    // loop through each day in the task list only one at the moment
    this.data.taskList.forEach((day: any) => {
      // loop through each timeline group in the day
      day.groups.forEach((group: any) => {
        // loop through each task in the timeline group
        group.tasks.forEach((task: any) => {
          task.contacts = [];
          if (task.contactNames) {
            task.contactNames.forEach((contactName: any) => {
              let contact = this.data.contacts.find((s: any) => s.name === contactName);
              if (contact) {
                task.contacts.push(contact);
                contact.tasks = contact.task || [];
                contact.tasks.push(task);
              }
            });
          }

          if (task.tracks) {
            task.tracks.forEach((track: any) => {
              if (this.data.tracks.indexOf(track) < 0) {
                this.data.tracks.push(track);
              }
            });
          }
        });
      });
    });

    return this.data;
  }

  getTimeline(dayIndex: number, queryText = '', excludeTracks: any[] = [], segment = 'all') {
    return this.load().map((data: any) => {
      let day = data.taskList[dayIndex];
      day.shownTasks = 0;

      queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      day.groups.forEach((group: any) => {
        group.hide = true;

        group.tasks.forEach((task: any) => {
          // check if this task should show or not
          this.filterTask(task, queryWords, excludeTracks, segment);

          if (!task.hide) {
            // if this task is not hidden then this group should show
            group.hide = false;
            day.shownTasks++;
          }
        });

      });

      return day;
    });
  }

  addTask(task: any, groupName: string){
    
    return new Promise((resolve, reject) => {

      var day = this.data.taskList[0];
      let wantedGroup = null; 
      let nextId = 0;
      day.groups.forEach((group: any) => {
        if (group.title === groupName)
          wantedGroup = group;
        
        nextId += group.length;
      });

      nextId++;
      task.id = nextId;
      if (wantedGroup){
        wantedGroup.push(task);
        resolve('task added!');
      }
      reject('task was not added!')
    });
    
  }

  updateTask(task: any){

    return new Promise((resolve, reject) => {

      var day = this.data.taskList[0];
    
      day.groups.forEach((group: any) => {
        let itemIndex = group.tasks.findIndex(item => item.id == task.id);
        if (itemIndex > -1){
          group.tasks[itemIndex] = task;
          resolve('task updated!');
        }
      });

      reject('error updating task!');
    });
  }

  deleteTask(task: any){

    return new Promise((resolve, reject) => {
      var day = this.data.taskList[0];
    
      day.groups.forEach((group: any) => {
        let itemIndex = group.tasks.findIndex(item => item.id == task.id);
        if (itemIndex > -1) {
          group.tasks.splice(itemIndex, 1);
          resolve('task removed!');
        }
      });
      
      reject('error updating task!');
    });
  }

  filterTask(task: any, queryWords: string[], excludeTracks: any[], segment: string) {

    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the task name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (task.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this task passes the query test
      matchesQueryText = true;
    }

    // if any of the tasks tracks are not in the
    // exclude tracks then this task passes the track test
    let matchesTracks = false;
    task.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segement is 'favorites', but task is not a user favorite
    // then this task does not pass the segment test
    let matchesSegment = false;
    if (segment === 'quickView') {
      if (this.user.hasQuickView(task.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    task.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getContacts() {
    return this.load().map((data: any) => {
      return data.contacts.sort((a: any, b: any) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  getTracks() {
    return this.load().map((data: any) => {
      return data.tracks.sort();
    });
  }

  getMap() {
    return this.load().map((data: any) => {
      return data.map;
    });
  }

  getTools() {
    return this.load().map((data: any) => {
      return data.tools;
    });
  }

}
