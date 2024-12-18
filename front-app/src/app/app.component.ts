import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChessMoveComponent } from './chess-move/chess-move.component';
import { ChessImageComponent } from './chess-image/chess-image.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ChessImageComponent,
    ChessMoveComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-app';
}
