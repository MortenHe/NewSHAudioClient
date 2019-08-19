import { Pipe, PipeTransform } from '@angular/core';
import * as path from 'path';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(songName: any): any {

    //Wenn Songname verfuegbar ist
    if (songName) {

      //Datei kommt als kompletter Pfad: nur Dateiname ausgeben, auch Dateiendung .mp3 streichen
      let fileName = path.basename(songName, '.mp3');
      return fileName.replace(/(^\d+ - |.+ - .+ - | \(.*\))/, '');
    }
  }
}