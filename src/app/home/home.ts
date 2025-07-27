import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FirestoreService } from '../../services/firestore-service';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SpeechService } from '../../services/speech-service';
import { HttpClient } from '@angular/common/http';
import { RaseedService } from '../../services/raseed-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import firebase from 'firebase/compat/app';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  @ViewChild('walletDialog') walletDialog!: TemplateRef<any>;
  currentDialogRef: MatDialogRef<any> | null = null;
  flip = false;
  downloadURL: string | null = null;
  transcript: string = '';
  isRecording: boolean = false;
  showChat:boolean = false;
  receiptsList:any[]=[];
  isLoading: boolean = false;
  //
  selectedFile: File | null = null;
  uploading: boolean = false;
  uploadStatus: string | null = null;
  uploadError: string | null = null;
  walletInfo:any;
  walletURL!:string;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef,private dialog: MatDialog, private raseedService:RaseedService, private speechService: SpeechService, private storage: AngularFireStorage,private firestoreService: FirestoreService) {
  }
  startVoiceInput() {
    this.isRecording = true;
    this.speechService.startRecording().then(audioBlob => {
      this.speechService.stopRecording();
      this.isRecording = false;

      this.speechService.sendSpeechData(audioBlob).subscribe({
        next: (response: any) => {
          console.log(response)
          console.log('Transcribed Text:', response.transcript);
          this.transcript = response.text;
        },
        error: err => {
          console.error('Error sending audio:', err);
        }
      });
    }).catch(err => {
      console.error('Recording error:', err);
      this.isRecording = false;
    });
  }
  stopVoiceInput() {
    this.isRecording = false;
    this.speechService.stopRecording();
  }
  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  // }
  upload(): void {
    if (!this.selectedFile) return;
    const filePath = `receipts/${Date.now()}_${this.selectedFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedFile);
    task.snapshotChanges()
      .pipe(finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.downloadURL = url;
          console.log('File available at:', url);
        });
      }))
      .subscribe();
  }
  toggleChat(){
    this.showChat = !this.showChat;
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.uploadStatus = null;
    this.uploadError = null;
    this.onUpload()
  }
  onUpload(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Please select a file first!';
      return;
    }
    this.uploading = true;
    this.isLoading = true;
    this.uploadError = null;
    const formData = new FormData();
    formData.append('receipt_file', this.selectedFile, this.selectedFile.name);
    this.raseedService.uploadFile(formData).subscribe(
      async  (response)=>{
        this.uploading = false;
        let res:any = response;
        console.log('Upload successful:', response);
        this.selectedFile = null; 
        this.isLoading = false;
        this.cdr.detectChanges();
        this.showSuccess()
        // try {
        //   console.log("waiting for update")
        //   await firebase.firestore().waitForPendingWrites();  // ✅ Wait for Firestore to sync writes
        //   this.getReceipts(); // ✅ Now you'll get the updated list
        // } catch (err) {
        //   console.error("Error waiting for pending writes:", err);
        //   this.getReceipts(); // Fallback
        // }
      },
      (error)=>{
        this.uploading = false;
          this.uploadStatus = 'Upload failed.';
          this.uploadError = `Error: ${error.message || error.statusText}`;
          console.error('Upload error:', error);
          if (error.error && error.error.detail) {
              this.uploadError += ` - ${error.error.detail}`;
          }
      }
    )
  }
  getReceipts(){
    this.isLoading = true;
    this.cdr.detectChanges();
     this.raseedService.fetchReceipts().subscribe(       
      (res) => {
        console.log("Fetched receipts from fetch api:", res);
        let receipts :any = res.sort((a, b) => {
          return new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime();
        });
        console.log(receipts)
        this.walletInfo = receipts[0];
        this.isLoading = false;
        this.cdr.detectChanges();
        this.showWalletCard()
      },
      (err) => {
        console.error("Error fetching receipts:", err); 
      }
    );
  }
  showWalletCard() {
    this.closeCurrentDialog();
    this.currentDialogRef  = this.dialog.open(this.walletDialog, {
      panelClass: 'full-screen-dialog',
      height: '350px',
      width: '550px'
    });
  }
  showSuccess(){
    this.currentDialogRef  = this.dialog.open(this.successDialog, {
       panelClass: 'transparent-dialog',
      width: '200px',
      height: '200px',
    });
  }
  closeCurrentDialog(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = null;
    }
  }

}
