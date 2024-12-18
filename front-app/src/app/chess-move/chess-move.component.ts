import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChessEvalService, ChessEvaluation } from './chess-eval.service';

@Component({
  selector: 'app-chess-move',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './chess-move.component.html',
  styleUrl: './chess-move.component.scss'
})
export class ChessMoveComponent {
  fenString: string = '';
  evaluationResult: ChessEvaluation = new ChessEvaluation();
  evaluation: number = 0;
  interpretation: string = '';

  constructor(private chessEvalService: ChessEvalService) {}

  evaluatePosition() {

    const chessboard = new Chessboard(this.fenString, 'chessboard');
    chessboard.createBoard();
    this.chessEvalService.evaluateChessPosition(this.fenString).subscribe({
      next: (response: any) => {
        console.log('Evaluation Response:', response);
        this.evaluationResult = response

        this.evaluation = Math.round(this.evaluationResult.Results.output1[0]['Scored Labels']);
  
        this.interpretation = 
        this.evaluation > 5000
          ? 'White has a decisive advantage.'
          : this.evaluation  < -5000
          ? 'Black has a decisive advantage.'
          : this.evaluation  > 0
          ? 'Slight advantage to White.'
          : this.evaluation  < 0
          ? 'Slight advantage to Black.'
          : 'The position is roughly equal.';
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to evaluate the position. Please check your input and try again.');
      },
    });
  }
}

type ChessPieces = { [key: string]: string };

class Chessboard {
  private pieces: ChessPieces = {
    p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
  };

  constructor(private fen: string, private elementId: string) {}

  createBoard(): void {
    const board = document.getElementById(this.elementId);
    if (!board) {
      console.error(`Element with id "${this.elementId}" not found.`);
      return;
    }

    board.innerHTML = ""; // Clear previous board

    const rows = this.fen.split(" ")[0].split("/"); // Split the FEN for ranks

    rows.forEach((row, rowIndex) => {
      let colIndex = 0;

      for (const char of row) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.style.gridRow = (rowIndex + 1).toString();
        cell.style.gridColumn = (colIndex + 1).toString();
        cell.style.display = "flex";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";
        cell.style.fontSize = "2rem";
        cell.style.fontFamily = "Arial, sans-serif";

        // Set alternating light/dark square colors
        cell.style.backgroundColor =
          (rowIndex + colIndex) % 2 === 0 ? "#eeeed2" : "#769656";

        if (isNaN(parseInt(char, 10))) {
          // If it's a piece, place it on the cell
          cell.innerHTML = this.pieces[char] || "";
          board.appendChild(cell);
          colIndex++;
        } else {
          // If it's a number, create empty cells
          const emptyCount = parseInt(char, 10);
          for (let i = 0; i < emptyCount; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "cell";
            emptyCell.style.gridRow = (rowIndex + 1).toString();
            emptyCell.style.gridColumn = (colIndex + 1).toString();

            // Apply alternating colors for empty squares
            emptyCell.style.backgroundColor =
              (rowIndex + colIndex) % 2 === 0 ? "#eeeed2" : "#769656";

            board.appendChild(emptyCell);
            colIndex++;
          }
        }
      }
    });
  }
}