import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { RaseedService,Receipt } from '../../services/raseed-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';

interface TransformedItem {
  itemName: string;
  quantity: number;
  totalPrice: number;
  transactionTime: string;
}

@Component({
  selector: 'app-receipt-history',
  standalone: false,
  templateUrl: './receipt-history.html',
  styleUrl: './receipt-history.scss'
})
export class ReceiptHistory {
  @ViewChild('menuDialog') menuDialog!: TemplateRef<any>;
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August'];
  selectedMonth = 'July';
  selectedCategory: string | null = null;
  filteredReceipts:any = [];
  totalExpense = 0;

  categories = [
    { name: 'Grocery', percent: 0 , imgsrc:'grocery'},
    { name: 'Food & Dining', percent: 0 , imgsrc:'food'},
    { name: 'Fashion & Apparel', percent: 0 , imgsrc:'fashion'},
    { name: 'Electronics', percent: 0 ,imgsrc:'electronics'},
    { name: 'Cosmetics & Care', percent: 0 ,imgsrc:'cosmetics'},
    { name: 'Entertainment', percent: 0 ,imgsrc:'movie'}
  ];
  receipts: Receipt[] = []; 
  isLoading:boolean = false;
  constructor(private receiptService: RaseedService,private dialog: MatDialog,private cdr: ChangeDetectorRef){
    this.isLoading = true;
    this.receipts= [];
    this.receiptService.getReceipts().subscribe(       
      (res) => {
        console.log("Fetched receipts:", res);
        this.receipts = res; 
        receiptService.receiptsForInsights = this.receipts;
        this.isLoading = false;
        this.cdr.detectChanges();
        this.updateCategoryPercentages();
        this.filterReceipts();
        // this.updateNotificationData()
      },
      (err) => {
        console.error("Error fetching receipts:", err); // <-- Use console.error for errors
      }
    );
  }
  ngOnInit() {
  }
  transformedItems: TransformedItem[] = [];
  updateNotificationData(){
    this.receipts.forEach(receipt => {
      const baseDateTime = receipt.transactionDate;
      const firstTwoItems = receipt.items.slice(0, 2); // Only first two
      firstTwoItems.forEach(item => {
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
    this.receiptService.receiptsForReminder = Reminder.map(item => {
      const date = new Date(item.transactionTime);
      if (!isValid(date)) return null;
      const relativeDate = formatDistanceToNow(new Date(item.transactionTime), { addSuffix: true });
      return `You bought '${item.itemName}' ${relativeDate}, do you want to repurchase?`;
    }).filter(msg => msg !== null)
    .slice(0, 10);
    console.log(this.receiptService.receiptsForReminder)
  }
  selectedReceiptItems:any;
  openDialog(data:any)  {
    console.log(data)
    this.selectedReceiptItems =  data
    this.dialog.open(this.menuDialog, {
      height: '350px',
      width: '550px',
      data: data
    });
  }
  toggleItems(receipt: any) {
    receipt.showItems = !receipt.showItems;
  }
  updateCategoryPercentages() {
    const catMap: { [key: string]: number } = {};
    this.filteredReceipts.forEach((r: { items: any[]; }) => {
      r.items?.forEach((item: { category: string | number; totalPrice: number; }) => {
        if (item.category && item.totalPrice > 0) {
          if (!catMap[item.category]) catMap[item.category] = 0;
          catMap[item.category] += item.totalPrice;
        }
      });
    });

    const total = Object.values(catMap).reduce((sum, val) => sum + val, 0);

    this.categories.forEach(cat => {
      const catTotal = catMap[cat.name] || 0;
      cat.percent = total ? Math.round((catTotal / total) * 100) : 0;
    });
  }
  filterReceipts() {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const currentYear = new Date().getFullYear();
    const start = new Date(currentYear, monthIndex, 1);
    const end = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59);

    this.filteredReceipts = this.receipts.filter(r => {
      const uploadedTime = r.uploadTime instanceof Date ? r.uploadTime : new Date(r.uploadTime);
      return uploadedTime >= start && uploadedTime <= end;
    });

    this.totalExpense = this.filteredReceipts.reduce((sum: any, r: { totalAmount: any; afterDiscountTotal: any; }) => sum + (r.totalAmount || r.afterDiscountTotal || 0), 0);
    this.updateCategoryPercentages();
  }

  filterByCategory(category: string) {
    this.selectedCategory = this.selectedCategory === category ? null : category;
    this.filterReceipts();
  }
}
