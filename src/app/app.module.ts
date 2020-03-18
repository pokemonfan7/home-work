import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '../lib/googlemaps.module';
import { LAZY_MAPS_API_CONFIG, LazyMapLoaderConfig } from '../lib/loaders/lazy-loader.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const mapConfig: LazyMapLoaderConfig = {
  apiKey: 'AIzaSyBDTxfgU-PW53fq3gJnSv_-EOpp5v5Erv8'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
  ],
  providers: [
    {
      provide: LAZY_MAPS_API_CONFIG, useValue: mapConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
