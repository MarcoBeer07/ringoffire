import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  @Input() avatarBox = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  newGame() {
    //startGame
    this.router.navigateByUrl('/game')
  }

}
