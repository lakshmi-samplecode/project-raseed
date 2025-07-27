import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  getReceipts(): Observable<any[]> {
    return this.firestore.collection('receipt').valueChanges({ idField: 'id' });
  }
}
