import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BackendService } from 'src/app/services/backend.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'mode-select',
    templateUrl: './mode-select.component.html',
    styleUrls: ['./mode-select.component.scss']
})
export class ModeSelectComponent implements OnInit {

    //Liste des AudioModes
    audioModes: any[] = [];

    //Selectbox fuer Audiomodus (sh, mh, kids)
    audioModeSelect: FormControl = new FormControl();

    constructor(private bs: BackendService) { }

    ngOnInit() {

        //Liste der audioModes Abo
        this.bs.getAudioModes().subscribe((audioModes: any[]) => {
            this.audioModes = audioModes;
        });

        //aktuellen audioMode abonnieren und passenden Select-Wert auswaehlen
        this.bs.getAudioMode().subscribe(audioMode => {
            const userModeIndex = this.audioModes.findIndex((obj) => {
                return obj.id === audioMode;
            });
            this.audioModeSelect.setValue(this.audioModes[userModeIndex], { emitEvent: false });
        });

        //Aenderung des audioModes an Server melden
        this.audioModeSelect.valueChanges.subscribe(audioMode => {
            this.bs.sendMessage({
                type: "set-audio-mode",
                value: {
                    "audioMode": audioMode.id
                }
            });
        });
    }
}