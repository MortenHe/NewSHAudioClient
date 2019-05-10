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

@NgModule({
  declarations: [
    AppComponent,
    FilterListPipe,
    FileNamePipe,
    OrderByPipe,
    HighlightDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
