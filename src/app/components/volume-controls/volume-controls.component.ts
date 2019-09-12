import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'volume-controls',
  templateUrl: './volume-controls.component.html',
  styleUrls: ['./volume-controls.component.scss']
})
export class VolumeControlsComponent implements OnInit {

  //aktuelles Volume
  volume = 50;

  constructor(private bs: BackendService) { }

  ngOnInit() {

    //volume abbonieren
    this.bs.getVolume().subscribe(volume => {
      this.volume = volume;
    });
  }

  //volume aendern
  changeVolume(increase) {
    this.bs.sendMessage({ type: "change-volume", value: increase });
  }
}