import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Input() responisiveView = false;
  pickCardAnimation = false;
  currentCard: string = ''
  game: Game;
  innerHeight: any;
  innerWidth: any;


  constructor(public dialog: MatDialog) {
    this.innerHeight = (window.screen.height) + "px";
    this.innerWidth = (window.screen.width) + "px";

  }

  ngOnInit(): void {
    this.newGame();

  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.pickCardAnimation && this.game.players.length > 0) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 950);
    } else if (this.game.players.length == 0) {
      alert('Please add players on with the button on bottom right')
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

  addStyle(i) {
    if (innerWidth > 1100) {
      return {
        'left.px': 40 + (i * 225)
      }
    } else if (innerWidth < 1100) {
      return {
        'left.px': 40 + (i * 60)
      }
    } else if (innerWidth < 500) {
      return {
        'left.px': 40 + (i * 50)
      }
    }
  }
}
