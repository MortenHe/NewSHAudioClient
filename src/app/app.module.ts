import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FilterListPipe } from './pipes/filter-list.pipe';
import { BackendService } from './services/backend.service';
import { FileNamePipe } from './pipes/file-name.pipe';
import { HighlightSearchPipe } from './pipes/highlight-search.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { ArrayShiftPipe } from './pipes/array-shift.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FilterListPipe,
    FileNamePipe,
    HighlightSearchPipe,
    OrderByPipe,
    ArrayShiftPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
