import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Input() responisiveView = false;

  game: Game;
  gameId: string;
  gameOver = false;
  innerHeight: any;
  innerWidth: any;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) {
    this.innerHeight = (window.screen.height) + "px";
    this.innerWidth = (window.screen.width) + "px";
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params.id);
      this.gameId = params.id;
      this.firestore
        .collection('games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((game: any) => {
          console.log('game update', game)
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.player_images = game.player_images;
          this.game.stack = game.stack;
          this.game.pickCardAnimation = game.pickCardAnimation;
          this.game.currentCard = game.currentCard;
        })
    })

  }

  newGame() {
    this.game = new Game();

  }

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation && this.game.players.length > 0) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      this.saveGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 930);
    } else if (this.game.players.length == 0) {
      alert('Please add players on with the button on bottom right')
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('user.png');
        this.saveGame();
      }
    });
  }

  saveGame() {
    this.firestore
      .collection('games')
      .doc(this.gameId)
      .update(this.game.toJson())
  }

  addStyle(i) {
    if (innerWidth > 1900) {
      return {
        'left.px': 40 + (i * 225)
      }
    } else if (innerWidth < 1900 && innerWidth > 1100) {
      return {
        'left.px': 40 + (i * 120)
      }
    } else if (innerWidth < 1100 && innerWidth > 500) {
      return {
        'left.px': 10 + (i * 65)
      }
    } else if (innerWidth < 500) {
      return {
        'left.px': 5 + (i * 45)
      }
    }
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe(change => {
      if (change) {
        if (change == 'DELETE') {
          this.game.player_images.splice(playerId, 1)
          this.game.players.splice(playerId, 1)
        } else {
          this.game.player_images[playerId] = change;
        }
        this.saveGame();
      }
    });

  }
}
