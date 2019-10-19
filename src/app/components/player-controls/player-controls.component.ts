import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss']
})
export class PlayerControlsComponent implements OnInit {

  //ist gerade pausiert?
  paused = false;

  constructor(private bs: BackendService) { }

  ngOnInit() {

    //paused abbonieren
    this.bs.getPaused().subscribe(paused => {
      this.paused = paused;
    });
  }

  //vor oder zureuck schalten
  changeItem(step: number) {
    this.bs.sendMessage({ type: "change-item", value: step });
  }

  //paused toggeln
  togglePaused() {
    this.bs.sendMessage({ type: "toggle-paused", value: "" });
  }
}