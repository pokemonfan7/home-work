import { Injectable, NgZone } from '@angular/core'
import { LazyMapLoaderService } from '../loaders/lazy-loader.service'

export abstract class GLable {
    bindTo: Function
    setMap: Function
    unbindAll: Function
    set: Function
    setValues: Function
    setOptions: Function
}

export class Label extends GLable {
  public onAdd: () => void
  public draw: () => void
  public onRemove: () => void
  // tslint:disable-next-line
  private content: HTMLElement

  constructor(content: HTMLElement) {
    super()
    this.content = content
    Object.setPrototypeOf(this, new google.maps.OverlayView())

    this.onAdd = function () {
      const panes = this.getPanes()
      this.content.style.position = 'absolute'
      panes.overlayLayer.appendChild(this.content)
    }

    this.draw = function () {
      const overlayProjection = this.getProjection()
      if (!overlayProjection) {
        return
      }
      const position = overlayProjection.fromLatLngToDivPixel(this.get('position'))
      if (this.content) {
        this.content.style.left = `${position.x}px`
        this.content.style.top = `${position.y}px`
      }
    }

    this.onRemove = function () {
      if (!this.content) {
        return
      }
      this.content.parentNode.removeChild(this.content)
      this.content = null
    }
  }
}

@Injectable()
export class ApiWrapperService {

  constructor(
    private mapLoader: LazyMapLoaderService,
    private ngZone: NgZone,
  ) {
  }

  createMap(elem: HTMLDivElement, options: google.maps.MapOptions): google.maps.Map {
    return this.ngZone.runOutsideAngular(() => {
      return new google.maps.Map(elem, options)
    })
  }

  createMarker(option: google.maps.MarkerOptions) {
    return this.ngZone.runOutsideAngular(() => {
      return new google.maps.Marker(option)
    })
  }

  createInfoWindow(option: google.maps.InfoWindowOptions) {
    return this.ngZone.runOutsideAngular(() => {
      return new google.maps.InfoWindow(option)
    })
  }

  createCircle(option: google.maps.InfoWindowOptions) {
    return this.ngZone.runOutsideAngular(() => {
      return new google.maps.Circle(option)
    })
  }

  createPolyline(option: google.maps.PolylineOptions) {
    return this.ngZone.runOutsideAngular(() => {
      return new google.maps.Polyline(option)
    })
  }

  createPolygon(option: google.maps.PolygonOptions) {
    return this.ngZone.runOutsideAngular(() => {
      return new google.maps.Polygon(option)
    })
  }

  createRectangle(option: google.maps.RectangleOptions) {
    return this.ngZone.runOutsideAngular(() => {
      return new google.maps.Rectangle(option)
    })
  }

  createLabel(content: HTMLElement): Label {
    return this.ngZone.runOutsideAngular(() => {
      return new Label(content)
    })
  }
}
