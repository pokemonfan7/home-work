import { Injectable, NgZone } from '@angular/core'
import { ApiWrapperService } from './api-wrapper.service'
import { GMapMarkerComponent } from '../components/gmap-marker/gmap-marker.component'
import { Observable } from 'rxjs'

@Injectable()
export class GMapMarkerService {

  constructor(
    private apiWrapper: ApiWrapperService,
    private ngZone: NgZone,
  ) {
  }

  createMarker(markerComponent: GMapMarkerComponent) {
    const option = this.componentAttrToOption(markerComponent)

    return this.apiWrapper.createMarker(option)
  }

  setIcon(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setIcon(markerComponent.icon)
    })
  }

  setAnimation(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setAnimation(markerComponent.animation)
    })
  }

  setClickable(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setClickable(markerComponent.clickable)
    })
  }

  setCursor(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setCursor(markerComponent.cursor)
    })
  }

  setDraggable(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setDraggable(markerComponent.draggable)
    })
  }

  setLabel(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setLabel(markerComponent.label)
    })
  }

  setMap(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setMap(markerComponent.gMap)
    })
  }

  setOpacity(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setOpacity(markerComponent.opacity)
    })
  }

  setOptions(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setOptions(this.componentAttrToOption(markerComponent))
    })
  }

  setPosition(markerComponent: GMapMarkerComponent) {
    const pos = {
      lat: markerComponent.latitude,
      lng: markerComponent.longitude
    }
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setPosition(pos)
    })
  }

  setShape(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setShape(markerComponent.shape)
    })
  }

  setTitle(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setTitle(markerComponent.title)
    })
  }

  setVisible(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setVisible(markerComponent.visible)
    })
  }

  setZIndex(markerComponent: GMapMarkerComponent) {
    this.ngZone.runOutsideAngular(() => {
      markerComponent.gMarker.setZIndex(markerComponent.zIndex)
    })
  }

  createEvent$<T>(name: string, markerComponent: GMapMarkerComponent) {

    return Observable.create(observer => {
      const gMarker = markerComponent.gMarker
      const listener = gMarker.addListener(name, (e: google.maps.MouseEvent) => {
          if (e) {
              e.stop()
          }
          observer.next(e)
      })

      return () => {
        observer.complete()
        google.maps.event.removeListener(listener)
      }
    })

  }

  private componentAttrToOption(markerComponent: GMapMarkerComponent): google.maps.MarkerOptions {
    return <google.maps.MarkerOptions>{
      anchorPoint: markerComponent.anchorPoint,
      map: markerComponent.gMap,
      animation: markerComponent.animation,
      clickable: markerComponent.clickable,
      crossOnDrag: markerComponent.crossOnDrag,
      cursor: markerComponent.cursor,
      draggable: markerComponent.draggable,
      icon: markerComponent.icon,
      label: markerComponent.label,
      opacity: markerComponent.opacity,
      position: {
        lat: markerComponent.latitude,
        lng: markerComponent.longitude
      },
      shape: markerComponent.shape,
      title: markerComponent.title,
      visible: markerComponent.visible,
      zIndex: markerComponent.zIndex
    }
  }
}
