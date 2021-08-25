import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OpenCVConfig } from 'ngx-document-scanner';
import { NgxDocumentScannerModule } from 'ngx-document-scanner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// set the location of the OpenCV files
const openCVConfig: OpenCVConfig = {
  openCVDirPath: '/assets/opencv'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxDocumentScannerModule.forRoot(openCVConfig),
    FlexLayoutModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
