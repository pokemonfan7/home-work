import { Injectable, NgZone } from '@angular/core'
import { GMapMapComponent } from '../components/gmap-map/gmap-map.component'
import { ApiWrapperService } from './api-wrapper.service'
import { Observable } from 'rxjs'

@Injectable()
export class GMapMapService {

  constructor(
    private apiWrapper: ApiWrapperService,
    private ngZone: NgZone,
  ) {
  }

  createMap(elem, mapComponent: GMapMapComponent) {
    let mapOption: google.maps.MapOptions = {
      center: {lat: mapComponent.latitude || 0, lng: mapComponent.longitude || 0},
      zoom: mapComponent.zoom,
      minZoom: mapComponent.minZoom,
      maxZoom: mapComponent.maxZoom,
      scaleControl: mapComponent.scaleControl,
      draggable: mapComponent.draggable,
      zoomControl: mapComponent.zoomControl,
      zoomControlOptions: mapComponent.zoomControlOptions,
      panControlOptions: mapComponent.panControlOptions,
      streetViewControlOptions: mapComponent.streetViewControlOptions,
      fullscreenControl: mapComponent.fullscreenControl,
      disableDoubleClickZoom: mapComponent.disableDoubleClickZoom,
      clickableIcons: mapComponent.clickableIcons,
      backgroundColor: mapComponent.backgroundColor,
      mapTypeId: mapComponent.mapTypeId,
      fullscreenControlOptions: mapComponent.fullscreenControlOptions,
      mapTypeControlOptions: mapComponent.mapTypeControlOptions,
    }

    if (mapComponent.otherOptions) {
      mapOption = {...mapOption, ...mapComponent.otherOptions}
    }

    return this.apiWrapper.createMap(elem, mapOption)
  }

  changeCenter(gmap: google.maps.Map, mapComponent: GMapMapComponent) {
    this.ngZone.runOutsideAngular(() => {
      gmap.setCenter({
        lat: mapComponent.latitude,
        lng: mapComponent.longitude
      })
    })
  }

  setZoom(gmap: google.maps.Map, mapComponent: GMapMapComponent) {
    this.ngZone.runOutsideAngular(() => {
      gmap.setZoom(mapComponent.zoom)
    })
  }

  createEvent$<T>(eventName, mapComponent: GMapMapComponent): Observable<{target: GMapMapComponent, event: T}> {
    return Observable.create((observer) => {
      const listener = this.ngZone.runOutsideAngular(() => {
        return mapComponent.gMap.addListener(eventName, (e: T) => {
          observer.next({
            target: mapComponent,
            event: e
          })
        })
      })

      return () => {
        observer.complete()
        google.maps.event.removeListener(listener)
      }
    })

  }
}
