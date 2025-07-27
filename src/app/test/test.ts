import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // Required for pipes like currency and date
import { RaseedService,Receipt } from '../../services/raseed-service';
 
@Component({
  selector: 'app-test',
  standalone: false,
  templateUrl: './test.html',
  styleUrl: './test.scss'
})
export class Test  implements OnInit, OnDestroy {
  receipts$!: Observable<Receipt[]>;
  private receiptsSubscription: Subscription | undefined; 
  constructor(private receiptService: RaseedService) { } 
  receipts: Receipt[] = []; 
  ngOnInit() {  
    this.receiptsSubscription = this.receiptService.getReceipts().subscribe( // <-- Assign to subscription variable
      (res) => {
        console.log("Fetched receipts:", res);
        this.receipts = res; 
        const flattenedItems = this.receipts.flatMap(receipt => {
        return receipt.items.map(item => ({
          uploadedTime: new Date(receipt.uploadTime),
          transactionDate: new Date(receipt.transactionDate),
          storeName: receipt.storeName,
          storeAddress: receipt.storeAddress,
          receiptId: receipt.receiptId,
          imageUrl: receipt.imageUrl,
          paymentMethod: receipt.paymentMethod,
          userId: receipt.userId,
          category: item.category,
          itemName: item.itemName,
          finalPrice: item.totalPrice,
          pricePerUnit: item.pricePerUnit,
          quantity: item.quantity,
          geminiInsights: receipt.gemini_insights
        }));
      });
      console.log(flattenedItems);
      },
      (err) => {
        console.error("Error fetching receipts:", err); // <-- Use console.error for errors
      }
    );
    this.receipts$ = this.receiptService.getReceipts();
  }
 
  /**
   * Handles the click event to view details of a specific receipt.
   * @param receiptId The ID of the receipt to view.
   */
  viewReceiptDetails(receiptId: string | undefined) {
    if (receiptId) {
      console.log('Viewing details for receipt:', receiptId);
    } else {
      console.warn('Attempted to view details for a receipt without an ID.');
    }
  }
 
  ngOnDestroy() {
    if (this.receiptsSubscription) {
      this.receiptsSubscription.unsubscribe();
      console.log('Receipts subscription unsubscribed.');
    }
  }
}
 
 