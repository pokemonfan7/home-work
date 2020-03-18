import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output,
  SimpleChanges
} from '@angular/core'
import { merge } from 'rxjs'
import { Subscription } from 'rxjs/internal/Subscription'
import { GMapPolygonService } from '../../services/gmap-polygon.service'

export interface PolygonEvent {
  event: google.maps.event
  polygon: google.maps.Polygon
}

export interface PathEvent {
  event: google.maps.event
  path: google.maps.MVCArray<google.maps.LatLng>
}

@Component({
  selector: 'gmap-polygon',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class GMapPolygonComponent implements OnChanges, OnDestroy {
  @Input() gMap

  @Input() paths

  @Input() draggable = false

  @Input() editable = false

  @Input() zIndex = 1

  @Input() strokeWeight = 0.5

  @Input() strokeOpacity = 0.8

  @Input() strokeColor = '#c4161c'

  @Input() fillColor = '#fafafa'

  @Input() fillOpacity = 0.8

  @Output() init = new EventEmitter()

  @Output() change = new EventEmitter()

  @Output() edited = new EventEmitter()

  @Output() click = new EventEmitter<PolygonEvent>()

  @Output() dblclick = new EventEmitter<PolygonEvent>()

  @Output() drag = new EventEmitter<PolygonEvent>()

  @Output() dragend = new EventEmitter<PolygonEvent>()

  @Output() dragstart = new EventEmitter<PolygonEvent>()

  @Output() mousedown = new EventEmitter<PolygonEvent>()

  @Output() mousemove = new EventEmitter<PolygonEvent>()

  @Output() mouseout = new EventEmitter<PolygonEvent>()

  @Output() mouseover = new EventEmitter<PolygonEvent>()

  @Output() mouseup = new EventEmitter<PolygonEvent>()

  @Output() rightclick = new EventEmitter<PolygonEvent>()

  @Output() bounds = new EventEmitter()

  @Output() initBounds = new EventEmitter()

  public subscriptions: Subscription[] = []

  public polygon: google.maps.Polygon

  constructor(
    private polygonService: GMapPolygonService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.paths) {
      return
    }
    if (!this.polygon) {
      this.polygon = this.polygonService.createPolygon(this)
      this.init.emit(this.polygon)
      const bounds = this.getBounds()
      this.bounds.emit(bounds)
      this.initBounds.emit(bounds)
      this.addMouseEvent()
      this.addPathEventListeners()
    } else {
      const polygonChange = Object.keys(changes)
      if (polygonChange.length) {
        this.polygonService.updatePolygon(this, polygonChange)
      }

      if (changes['paths']) {
        const bounds = this.getBounds()
        this.bounds.emit(bounds)
        this.addPathEventListeners()
      }

    }

    this.change.emit(this)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe()
    })
    this.polygonService.destroy(this)
  }

  private getBounds() {
      const bounds = new google.maps.LatLngBounds()
      const paths = this.polygon.getPaths()
      let path
      for (let i = 0; i < paths.getLength(); i++) {
          path = paths.getAt(i)
          for (let ii = 0; ii < path.getLength(); ii++) {
              bounds.extend(path.getAt(ii))
          }
      }

      return bounds
  }

  private addMouseEvent() {
    const events = [
      { name: 'click', event: this.click },
      { name: 'dblclick', event: this.dblclick },
      { name: 'drag', event: this.drag },
      { name: 'dragend', event: this.dragend },
      { name: 'dragstart', event: this.dragstart },
      { name: 'mousedown', event: this.mousedown },
      { name: 'mousemove', event: this.mousemove },
      { name: 'mouseout', event: this.mouseout },
      { name: 'mouseover', event: this.mouseover },
      { name: 'mouseup', event: this.mouseup },
      { name: 'rightclick', event: this.rightclick },
    ]
    const subs = events.map(item => {
      return this.polygonService.createEvent$<PolygonEvent>(item.name, this)
        .subscribe(e => item.event.emit(e))
    })

    this.subscriptions = this.subscriptions.concat(subs)
  }

  private addPathEventListeners() {
    const setAt$ = this.polygonService.createPathsEvent$<PathEvent>('set_at', this)
    const insertAt$ = this.polygonService.createPathsEvent$<PathEvent>('insert_at', this)
    const removeAt$ = this.polygonService.createPathsEvent$<PathEvent>('remove_at', this)
    const editedSub = merge(setAt$, insertAt$, removeAt$).subscribe(() => {
      this.edited.emit(this.polygon)
    })

    this.subscriptions.push(editedSub)
  }
}
