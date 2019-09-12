import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FilterListPipe } from './pipes/filter-list.pipe';
import { BackendService } from './services/backend.service';
import { FileNamePipe } from './pipes/file-name.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { HighlightDirective } from './directives/highlight.directive';

//Sortable JS
import { SortablejsModule } from 'ngx-sortablejs';

//eigene Komponenten
import { PlayerControlsComponent } from './components/player-controls/player-controls.component';
import { VolumeControlsComponent } from './components/volume-controls/volume-controls.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { ModeSelectComponent } from './components/mode-select/mode-select.component';
import { PiControlsComponent } from './components/pi-controls/pi-controls.component';
import { PlayListComponent } from './components/play-list/play-list.component';
import { FileService } from './service/file.service';

@NgModule({
  declarations: [
    AppComponent,
    PlayerControlsComponent,
    FilterListPipe,
    FileNamePipe,
    OrderByPipe,
    HighlightDirective,
    VolumeControlsComponent,
    SearchFieldComponent,
    ModeSelectComponent,
    PiControlsComponent,
    PlayListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    SortablejsModule.forRoot({
      animation: 350,
      draggable: '.drag',
      handle: '.sort-handle',
      filter: ".ignore-sort",
      chosenClass: "sortable-chosen"
    }),
  ],
  providers: [
    BackendService,
    FileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
