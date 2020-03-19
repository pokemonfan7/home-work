import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '../lib/googlemaps.module';
import { LAZY_MAPS_API_CONFIG, LazyMapLoaderConfig } from '../lib/loaders/lazy-loader.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FileInputComponent } from './file-input/file-input.component';
registerLocaleData(zh);

const mapConfig: LazyMapLoaderConfig = {
  apiKey: 'AIzaSyBDTxfgU-PW53fq3gJnSv_-EOpp5v5Erv8'
};

@NgModule({
  declarations: [
    AppComponent,
    FileInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    NgZorroAntdModule,
  ],
  providers: [
    { provide: LAZY_MAPS_API_CONFIG, useValue: mapConfig },
    { provide: NZ_I18N, useValue: zh_CN }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
