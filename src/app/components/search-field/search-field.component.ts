import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FilterListPipe } from 'src/app/pipes/filter-list.pipe';
import { FileNamePipe } from 'src/app/pipes/file-name.pipe';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit {

  //Suchfeld fuer Titelliste
  titleSearch: FormControl = new FormControl("");

  //Liste der Files
  files = [];

  //Liste der gefilterten Files
  filteredFiles = [];

  //Pipes in Comp. aufrufen
  filterListPipe = new FilterListPipe();
  fileNamePipe = new FileNamePipe();

  constructor(private bs: BackendService) { }

  ngOnInit() {

    //Files abonnieren
    this.bs.getFiles().subscribe(files => {
      this.files = files;
    })

    //Wenn im Suchfeld gesucht wird, Trefferliste filtern anhand des Suchterms
    this.titleSearch.valueChanges.subscribe(term => {
      this.filterFiles(term.trim());
    });
  }

  //Titelliste filtern anhand des Suchterms
  filterFiles(term) {

    //gefilterte Titelliste zuruecksetzen
    this.filteredFiles = [];

    //Wenn mind. 2 Buchstaben eingegeben wurden
    if (term.length >= 2) {

      //Titelliste anhand des Terms filtern
      let tempFilteredFiles = this.filterListPipe.transform(this.files, term);

      //Ueber gefiltertete Titelliste gehen
      for (let file of tempFilteredFiles) {

        //Namensform anpassen (Pfad und Dateiendung weg)
        let tempFileName = this.fileNamePipe.transform(file.fileName);

        //Titel (ausser dem aktuell laufemden) in Liste der gefilterteten Titel einfuegen
        if (file.index !== 0) {
          this.filteredFiles.push({
            fileName: tempFileName,
            index: file.index
          });
        }
      }
    }
  }

  //Aus Trefferliste der Suche einen Titel einreihen und Suchfeld danach leeren
  enqueueSongFromSearch(index) {
    //this.enqueueSong(index);
    this.titleSearch.setValue("");
  }

  //Aus Trefferliste der Suche zu einem Titel springen und Suchfeld danach leeren
  jumpToFromSearch(position: number) {
    //this.jumpTo(position);
    this.titleSearch.setValue("");
  }

}
