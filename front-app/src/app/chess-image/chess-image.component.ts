import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chess-image',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './chess-image.component.html',
  styleUrls: ['./chess-image.component.scss'],
})
export class ChessImageComponent {
  imageSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  predictionResult: any = null;
  chessProbability: number = 0;
  isChess: boolean = false;
  selectedService: 'azure' | 'docker' = 'azure'; // Default to Azure

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  sendImage(): void {
    if (!this.selectedFile) {
      alert('Please select an image file first.');
      return;
    }

    if (this.selectedService === 'azure') {
      this.sendToAzure();
    } else {
      this.sendToDocker();
    }
  }

  sendToAzure(): void {
    const endpoint =
      'https://chessboardtrainingaicloud-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/a4f680f6-be0e-429c-ac17-e42b3bfc52ab/classify/iterations/ChessDetectionModel/image';
    const predictionKey = '6aEbsMhjxx0AubGrzSs0bsiOJLHAnxpQGJJ6FmXU0jIHpnCswbk9JQQJ99ALAC5RqLJXJ3w3AAAIACOGCpmE';

    const headers = new HttpHeaders({
      'Prediction-Key': predictionKey,
      'Content-Type': 'application/octet-stream',
    });

    this.http.post(endpoint, this.selectedFile, { headers }).subscribe({
      next: (response: any) => {
        this.predictionResult = response;
        this.processPrediction(response);
      },
      error: (error) => {
        console.error('Error during prediction (Azure):', error);
      },
    });
  }

  sendToDocker(): void {
    const endpoint = 'http://127.0.0.1/image';
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
    });

    this.http.post(endpoint, this.selectedFile, { headers }).subscribe({
      next: (response: any) => {
        this.predictionResult = response;
        this.processPrediction(response);
      },
      error: (error) => {
        console.error('Error during prediction (Docker):', error);
      },
    });
  }

  processPrediction(response: any): void {
    const predictions = response.predictions;
    const chessPrediction = predictions.find(
      (p: any) => p.tagName === 'Chess'
    );

    if (chessPrediction) {
      this.chessProbability = chessPrediction.probability;
      this.isChess = this.chessProbability > 0.5;
    } else {
      this.chessProbability = 0;
      this.isChess = false;
    }
  }
}
