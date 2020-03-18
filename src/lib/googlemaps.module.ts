import { NgModule } from '@angular/core';
import { GMapMapComponent } from './components/gmap-map/gmap-map.component';
import { GMapMarkerComponent } from './components/gmap-marker/gmap-marker.component';
import { GMapPolygonComponent } from './components/gmap-polygon/gmap-polygon.component';

import { LazyMapLoaderService } from './loaders/lazy-loader.service';
import { ApiWrapperService } from './services/api-wrapper.service';
import { GMapMapService } from './services/gmap-map.service';
import { GMapMarkerService } from './services/gmap-marker.service';
import { GMapPolygonService } from './services/gmap-polygon.service';

const COMPONENTS = [
    GMapMapComponent,
    GMapMarkerComponent,
    GMapPolygonComponent,
];

const GMAP_SERVICES = [
    ApiWrapperService,
    GMapMapService,
    GMapMarkerService,
    GMapPolygonService,
];


@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [],
    exports: [
        ...COMPONENTS,
    ],
    providers: [
        LazyMapLoaderService,
        ...GMAP_SERVICES
    ]
})
export class GoogleMapsModule {
}
