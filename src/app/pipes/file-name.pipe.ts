import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(songName: any): any {

    //Wenn Songname verfuegbar ist
    if (songName) {

      //Datei kommt als kompletter Pfad: nur Dateiname ausgeben, auch Dateiendung .mp3 streichen
      let songNameDisplay = songName.split(/[\\/]/).pop();
      songNameDisplay = songNameDisplay.replace(/.mp3/i, '');
      return songNameDisplay;
    }
  }
}