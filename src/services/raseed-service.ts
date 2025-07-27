import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { ToastrService } from 'ngx-toastr';

// Define the interface for individual items within a receipt
export interface Item {
  category: string;
  itemName: string;
  pricePerUnit: number;
  quantity: number;
  totalPrice: number;
}
 
// Define the Receipt interface to match your Firebase document structure
export interface Receipt {
  id?: string; // Firestore document ID, optional as it's added by Firestore
  afterDiscountTotal: number;
  discountAmount: number;
  gemini_insights: string;
  imageUrl: string;
  items: Item[]; // Using the more specific Item interface
  paymentMethod: string;
  receiptId: string; // This is likely the unique ID generated before upload
  storeAddress: string;
  storeName: string; // Changed from merchantName to storeName to match your data
  taxAmount: number;
  totalAmount: number;
  transactionDate: string; // Matches "YYYY-MM-DD" string format from your data
  uploadTime: Date ;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RaseedService {
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*')
 
  // uploadURL = 'http://0.0.0.0:8080/upload-receipt'
  uploadURL = 'https://file-uploader-api-580825138040.us-central1.run.app/upload-receipt'
  private receiptsCollection!: AngularFirestoreCollection<Receipt>;
  private backendUrl = 'http://127.0.0.1:8000/';
  receiptsForInsights:any[]=[];
  receiptsForReminder:any[]=[];
  reminderList:any;
  constructor(private http: HttpClient, private firestore: AngularFirestore,private toastr: ToastrService) {
    this.receiptsCollection = firestore.collection<Receipt>('raseed', (ref) =>
      ref.orderBy('uploadTime', 'desc')
    );
    this.reminderList = [
      { message: 'You are running low on detergent - last bought 3 weeks ago.', time: new Date() },
      { message: 'Your dining expense this month crossed ₹5,000 – try homemade meals!', time: new Date() },
      { message: 'You’ve visited Reliance Fresh 3 times this month – try a combo deal?', time: new Date() },
      { message: 'Out of toothpaste soon? Last purchase was 28 days ago.', time: new Date() },
      { message: 'You bought shampoo last 45 days ago - reorder?', time: new Date()},
      { message: 'Your milk purchase was 10 days ago – time for a refill?', time: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { message: 'Your coffee stock might be low – reorder your favorite brand?', time: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { message: 'No rice purchases in the last 60 days – running low?', time: new Date(new Date().setDate(new Date().getDate() - 2)) },
      { message: 'Your last vegetable order was 3 days ago – schedule next delivery?', time: new Date(new Date().setDate(new Date().getDate() - 2)) }
    ];
  }
  //to upload file
  uploadFile(data:FormData){
    return this.http.post(this.uploadURL,data);
  }
  //getreceipts
  getReceipts(): Observable<Receipt[]> {
    return this.receiptsCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {          
          const data = a.payload.doc.data() as Receipt;
          const id = a.payload.doc.id;
          if (data.uploadTime instanceof firebase.firestore.Timestamp) {
            data.uploadTime = data.uploadTime.toDate();
          }
          return { id, ...data }; 
        })
      )
    );
  }
  fetchReceipts(): Observable<Receipt[]> {
    return from(this.receiptsCollection.get()).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((doc) => {
          const data = doc.data() as Receipt;
          const id = doc.id;

          if (data.uploadTime instanceof firebase.firestore.Timestamp) {
            data.uploadTime = data.uploadTime.toDate();
          }

          return { id, ...data };
        });
      })
    );
  }
  sendFileUrl(downloadUrl: string): Observable<any> {
    const payload = { ImageUrl: downloadUrl };
    return this.http.post(this.backendUrl + 'analyse', payload);
  }
 
  generatePass(receipt_json: any): Observable<any> {
    const payload = { receipt_json: receipt_json };
    return this.http.post(this.backendUrl + 'generate-wallet-pass', payload);
  }
 
  sendUserMessage(userMessage: string): Observable<any> {
    const payload = { user_input: userMessage };
    return this.http.post(this.backendUrl + 'multilingual_chatbot', payload);
  }
  /**
   * Retrieves a single receipt by its ID in real-time.
   * @param id The ID of the receipt document.
   */
  getReceipt(id: string): Observable<Receipt | undefined> {
    return this.receiptsCollection
      .doc<Receipt>(id)
      .valueChanges()
      .pipe(
        map((data) => {
          if (data && data.uploadTime instanceof firebase.firestore.Timestamp) {
            data.uploadTime = data.uploadTime.toDate();
          }
          return data;
        })
      );
  }
 
  /**
   * Adds a new receipt document to the 'receipts' collection.
   * This method would typically be called by your Cloud Function,
   * but is included here for completeness if you ever need to add from frontend.
   * @param receipt The receipt object to add.
   */
  addReceipt(receipt: Receipt) {
    // Firestore automatically generates an ID if you use .add()
    return this.receiptsCollection.add(receipt);
  }
 
  /**
   * Updates an existing receipt document.
   * @param id The ID of the receipt document to update.
   * @param data The partial data to update.
   */
  updateReceipt(id: string, data: Partial<Receipt>) {
    return this.receiptsCollection.doc(id).update(data);
  }
 
  /**
   * Deletes a receipt document.
   * @param id The ID of the receipt document to delete.
   */
  deleteReceipt(id: string) {
    return this.receiptsCollection.doc(id).delete();
  }
}

