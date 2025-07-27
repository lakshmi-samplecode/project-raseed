import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private mediaRecorder: any;
  private audioChunks: any[] = [];
  private apiUrl = 'http://localhost:3000/speech-to-english';
  constructor(private http: HttpClient) {
  }
startRecording() {
    return new Promise<Blob>((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event: { data: { size: number; }; }) => {
          if (event.data.size > 0) this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          resolve(audioBlob);
        };

        this.mediaRecorder.onerror = reject;

        this.mediaRecorder.start();
      }).catch(reject);
    });
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  sendSpeechData(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'speech.wav');
    return this.http.post(this.apiUrl, formData);
  }
}
