import { Component } from '@angular/core';
import { RaseedService } from '../../services/raseed-service';

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class Notifications {
  reminderList:any[]=[];
  constructor(private raseedservice: RaseedService){
    // this.reminderList =  this.raseedservice.reminderList;
    this.reminderList = this.raseedservice.receiptsForReminder;
  }
  filterDate: string = 'all';
  get availableDates(): string[] {
    const dates = this.reminderList.map(item => {
      const d = new Date(item.time);
      // Format to yyyy-mm-dd string for easy comparison
      return d.toISOString().split('T')[0];
    });

    const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a)); // descending
    return ['today', ...uniqueDates]; // include 'today' as a special label
  }

  get filteredReminders() {
    const todayStr = new Date().toISOString().split('T')[0];

    return this.reminderList.filter(item => {
      const itemDateStr = new Date(item.time).toISOString().split('T')[0];

      if (this.filterDate === 'today') return itemDateStr === todayStr;
      if (this.filterDate === 'all') return true;
      return itemDateStr === this.filterDate;
    });
  }

}
