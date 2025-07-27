import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RaseedService, Receipt } from '../services/raseed-service';
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})

export class App {
  protected title = 'Project-Raseed';
  routeName:any;
  isLoginPage:boolean=false;
  constructor(public router : Router,private raseedService:RaseedService, private toastr: ToastrService){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routeName = this.router.url.replace(/^\/+/, '');
        if(this.routeName == ''){
          this.isLoginPage = true;
        }
        else{
          this.isLoginPage = false;
        }
      }
    })
    this.raseedService.getReceipts().subscribe(       
      (res) => {
        console.log("Fetched receipts from app", res);
        raseedService.receiptsForInsights = res;
        this.updateNotificationData(res)
      },
      (err) => {
        console.error("Error fetching receipts:", err); 
      }
    );
  }
  transformedItems:any=[];
  updateNotificationData(res:any){
    res.forEach((receipt :any) => {
      const baseDateTime = receipt.transactionDate;
      const firstTwoItems = receipt.items.slice(0, 2); // Only first two
      firstTwoItems.forEach((item: { itemName: any; quantity: any; totalPrice: any; }) => {
        this.transformedItems.push({
          itemName: item.itemName,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          transactionTime: baseDateTime
        });
      });
    });
    let Reminder = this.transformedItems
    const today = new Date().toISOString().split('T')[0]; 
    this.raseedService.receiptsForReminder = Reminder.map((item:any) => {
      const date = new Date(item.transactionTime);
      if (!isValid(date)) return null;
      const relativeDate = formatDistanceToNow(new Date(item.transactionTime), { addSuffix: true });
      return `You bought '${item.itemName}' ${relativeDate}, do you want to repurchase?`;
    }).filter((msg: null) => msg !== null)
    .slice(0, 10);
    console.log(this.raseedService.receiptsForReminder)
    this.reminders = this.raseedService.receiptsForReminder
    this.startNotifications()
    }
  //send notifications
  //receiptsForReminder
  reminders:any=[]
  messageIndex = 0;

  startNotifications() {
    setInterval(() => {
      if (this.reminders.length === 0) return;

      const message = this.reminders[this.messageIndex];
      this.toastr.show(
        `<div class="custom-toast-content">${message}</div>`,
        'Raseed Reminder',
        {
          enableHtml: true,
          closeButton: true,
          toastClass: 'ngx-toastr custom-toast toast-buy'
        }
      );

      this.messageIndex = (this.messageIndex + 1) % this.reminders.length;
    }, 10000); // 10 seconds
  }

  selectedFile: File | null = null;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
}
