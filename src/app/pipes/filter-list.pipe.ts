import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterList'
})
export class FilterListPipe implements PipeTransform {

  transform(songs: string[], term: string): any {

    //Suchstring trimmen
    let searchString = term.trim();

    //Wenn kein Suchbegriff eingetragen ist -> keine Dateien ausgeben
    if (!searchString) {
      return null;
    }

    //Es ist ein Suchgegriff eingetragen
    else {

      //Sammeln, welche Songs angezeigt werden
      let displaySongs = [];

      //Ueber Songs gehen
      songs.forEach((songName, index) => {

        //Pruefen ob jeder Term aus Suchstring im Songname vorkommt
        if (this.match(songName, searchString)) {

          //Songs hinzufuegen, die Suchkriterium erfuellen
          displaySongs.push({ fileName: songName, index: index });
        }
      });
      return displaySongs;
    }
  }

  //Pruefen, ob jeder Term aus Suchstring in Songname vorkommt
  match(item, searchString) {

    //Datei kommt als kompletter Pfad: nur Dateiname ausgeben (auch Dateiendung mp3 streichen)
    let itemName = item.split(/[\\/]/).pop();
    itemName = itemName.replace(/.mp3/i, '');

    //durchsuchten String und Suchstring als lowercase: "Bobo Drache" -> "bobo drache"
    let haystackLower = itemName.toLowerCase();
    let searchStringLower = searchString.toLowerCase();

    //Suchstring in einzelne Terme aufteilen: "bobo drache" -> ["bobo", "drache"]
    let searchStringArray = searchStringLower.split(" ");

    //davon ausgehen, dass Suche gefunden wird
    let containsSubstrings = true;

    //Alle Terme des Suchstrings pruefen, ob sie im durchsuchten String enthalten sind
    for (let searchStringValue of searchStringArray) {

      //Nur nicht-leere Terme ansehen
      if (searchStringValue.trim() != "") {

        //wenn Term nicht in Suchstring enthalten ist
        if (haystackLower.indexOf(searchStringValue) === -1) {

          //dieses Item fuer Anzeige ignorieren und keine weiteren Terme mehr pruefen
          containsSubstrings = false;
          break;
        }
      }
    }
    return containsSubstrings;
  }
}