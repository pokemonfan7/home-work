import { Injectable, NgZone } from '@angular/core'
import { Observable } from 'rxjs/internal/Observable'
import { GMapPolygonComponent } from '../components/gmap-polygon/gmap-polygon.component'
import { ApiWrapperService } from './api-wrapper.service'

@Injectable()
export class GMapPolygonService {

  constructor(
    private apiWrapper: ApiWrapperService,
    private zone: NgZone,
  ) {
  }

  createPolygon(polygonComponent: GMapPolygonComponent) {
    const polygonOption = this.componentAttrToOption(polygonComponent)
    const polygon = this.apiWrapper.createPolygon(polygonOption)

    return polygon
  }

  updatePolygon(polygonComponent: GMapPolygonComponent, changedKeys: string[]) {
    const options = {}
    changedKeys.forEach(item => {
      options[item] = polygonComponent[item]
    })
    return polygonComponent.polygon.setOptions(options)
  }

  createEvent$<T>(eventName: string, polygonComponent: GMapPolygonComponent): Observable<T> {
    return Observable.create((observer) => {
      const gPolygon = polygonComponent.polygon
      const listener = gPolygon.addListener(eventName, (e) => {
        observer.next(e)
      })

      return () => {
        observer.complete()
        if (listener) {
          google.maps.event.removeListener(listener)
        }
      }
    })
  }

  createPathsEvent$<T>(eventName: string, polygonComponent: GMapPolygonComponent): Observable<T> {
    return Observable.create((observer) => {
      const path = polygonComponent.polygon.getPath()
      const listener = path.addListener(eventName, (e) => this.zone.run(() => observer.next({
        event: e,
        path
      })))

      return () => {
        observer.complete()
        if (listener) {
          google.maps.event.removeListener(listener)
        }
      }
    })
  }

  destroy(polygonComponent: GMapPolygonComponent) {
    polygonComponent.polygon.setMap(null)
  }

  private componentAttrToOption(polygonComponent: GMapPolygonComponent): google.maps.PolygonOptions {
    return {
      map: polygonComponent.gMap,
      paths: polygonComponent.paths,
      draggable: polygonComponent.draggable,
      editable: polygonComponent.editable,
      strokeColor: polygonComponent.strokeColor,
      strokeOpacity: polygonComponent.strokeOpacity,
      strokeWeight: polygonComponent.strokeWeight,
      fillColor: polygonComponent.fillColor,
      fillOpacity: polygonComponent.fillOpacity,
      zIndex: polygonComponent.zIndex,
    }
  }
}
