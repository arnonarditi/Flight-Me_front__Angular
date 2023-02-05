import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app-root/app.component';
import { AppHeaderComponent } from './cmps/app-header/app-header.component';
import { FlightFilterComponent } from './cmps/flight-filter/flight-filter.component';
import { FlightListComponent } from './cmps/flight-list/flight-list.component';
import { FlightPreviewComponent } from './cmps/flight-preview/flight-preview.component';
import { SegmentPreviewComponent } from './cmps/segment-preview/segment-preview.component';
import { CeilPipe } from './pipes/ceil.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { StopsPipe } from './pipes/stops.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    FlightFilterComponent,
    FlightListComponent,
    FlightPreviewComponent,
    SegmentPreviewComponent,
    CeilPipe,
    FormatDatePipe,
    StopsPipe,
  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
