import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(songName: any, term: string): any {

    //Wenn der Songname nicht leer ist
    if (songName) {

      //Datei kommt als kompletter Pfad: nur Dateiname ausgeben, auch Dateiendung .mp3 streichen
      let songNameDisplay = songName.split(/[\\/]/).pop();
      songNameDisplay = songNameDisplay.replace(/.mp3/i, '')

      //Wenn es einen Suchstring gibt
      if (term) {

        //Suchstring in einzelne Terme aufteilen: "bobo drache" -> ["bobo", "drache"]
        let searchStringArray = term.split(" ");

        //Alle Terme des Suchstrings in Liedtitel highlighten
        for (let searchStringValue of searchStringArray) {

          //Nur nicht-leere Terme ansehen
          if (searchStringValue.trim() != "") {

            //Regex erzeugen
            var reg = new RegExp(searchStringValue, 'gi');

            //Originalteil highlight mit <b>
            songNameDisplay = songNameDisplay.replace(reg, function (str) { return '<b>' + str + '</b>' });
          }
        }
      }

      //Dateiname ausgeben
      return songNameDisplay;
    }
  }
}