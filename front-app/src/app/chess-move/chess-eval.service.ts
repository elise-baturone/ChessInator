import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChessEvalService {
  private apiUrl = '/score';
  private token = 'wXyM7C8jtcYcepaJ7jgzY0Bq274pHyCw';

  constructor(private http: HttpClient) {}

  evaluateChessPosition(fen: string) {
    const payload = {
      Inputs: {
        input1: [{ FEN: fen }],
      },
      GlobalParameters: {},
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, payload, { headers });
  }
}


export class ChessEvaluation {
    Results!: Results;
  }
  
  export class Results {
    output1!: Output1Item[];
  }
  
  export class Output1Item {
    "Scored Labels"!: number;
    active_color!: string;
    castling_rights!: string;
    en_passant!: string;
    row1!: string;
    row2!: string;
    row3!: string;
    row4!: string;
    row5!: string;
    row6!: string;
    row7!: string;
    row8!: string;
  }
  