import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'mode-select',
  templateUrl: './mode-select.component.html',
  styleUrls: ['./mode-select.component.scss']
})
export class ModeSelectComponent implements OnInit {

  //AudioModes laden aus config
  modes = environment.modes;

  //Aktueller Audiomodus (sh, mh, kids)
  audioMode = "";

  constructor(private bs: BackendService) { }

  ngOnInit() {

    //audioMode abonnieren
    this.bs.getAudioMode().subscribe(audioMode => {
      this.audioMode = audioMode;
    });
  }

  //Audiomodus setzen (sh, mh, kids)
  setAudioMode(audioMode) {
    this.bs.sendMessage({
      type: "set-audio-mode",
      value: {
        "audioMode": audioMode
      }
    });
  }
}