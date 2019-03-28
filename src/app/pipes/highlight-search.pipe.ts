import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearch'
})
export class HighlightSearchPipe implements PipeTransform {

  transform(songName: any, term: string): any {

    //Wenn der Songname nicht leer ist
    if (songName) {

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
            songName = songName.replace(reg, function (str) { return '<b>' + str + '</b>' });
          }
        }
      }

      //Dateiname ausgeben
      return songName;
    }
  }
}