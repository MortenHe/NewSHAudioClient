import { Pipe, PipeTransform } from '@angular/core';
import * as path from 'path';
import * as slash from 'slash';
import * as process from 'process';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(songName: any): any {
    if (songName) {

      //Datei kommt als kompletter Pfad: nur Dateiname ausgeben, auch Dateiendung .mp3 streichen
      const fileName = path.basename(songName, '.mp3');
      return fileName.replace(/(^\d+ - |.+ - .+ - )/, '');
    }
  }
}