import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnChanges, OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core'
import { GMapMarkerService } from '../../services/gmap-marker.service'
import { GMap, GMapPoint, GMarkerAnimation, GMarkerShape } from '../../types'
import { Subscription } from 'rxjs'

@Component({
  selector: 'gmap-marker',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GMapMarkerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() longitude = 0

  @Input() latitude = 0

  @Input() title: string

  @Input() crossOnDrag = true

  @Input() cursor: string

  @Input() draggable = false

  @Input() label: string

  @Input() visible = true

  @Input() opacity = 1

  @Input() optimized = true

  @Input() zIndex = 1

  @Input() clickable = true

  /**
   * The offset from the marker's position to the tip of an InfoWindow that has been opened with the marker as anchor.
   */
  @Input() anchorPoint: GMapPoint

  /**
   * Which animation to play when marker is added to a map.
   */
  @Input() animation: GMarkerAnimation

  @Input() shape: GMarkerShape

  @Input() gMap: GMap

  @Input() icon: google.maps.Icon | string
  @Output() inited = new EventEmitter()

  @Output() markerClick = new EventEmitter()
  // @Output() animationChanged = new EventEmitter()
  // @Output() clickableChanged = new EventEmitter()
  // @Output() cursorChanged = new EventEmitter()
  // @Output() dblclick = new EventEmitter()
  // @Output() drag = new EventEmitter()
  // @Output() dragend = new EventEmitter()
  // @Output() draggableChanged = new EventEmitter()
  // @Output() dragstart = new EventEmitter()
  // @Output() flatChanged = new EventEmitter()
  // @Output() iconChanged = new EventEmitter()
  // @Output() mousedown = new EventEmitter()
  // @Output() mousedout = new EventEmitter()
  // @Output() mousedover = new EventEmitter()
  // @Output() mouseup = new EventEmitter()
  // @Output() positionChanged = new EventEmitter()
  // @Output() rightclick = new EventEmitter()
  // @Output() shapeChanged = new EventEmitter()
  // @Output() titleChanged = new EventEmitter()
  // @Output() visibleChanged = new EventEmitter()
  // @Output() zindexChanged = new EventEmitter()

  gMarker: google.maps.Marker

  private subs: Subscription[] = []

  constructor(
    private markerService: GMapMarkerService,
  ) {}

  ngOnInit() {
    this.gMarker = this.markerService.createMarker(this)
    this.addEventListeners()
    this.inited.emit(this.gMarker)
    this.inited.complete()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.gMarker) {
      return
    }

    if (changes['icon']) {
      this.markerService.setIcon(this)
    }

    if (changes['gMap']) {
      this.markerService.setMap(this)
    }

    if (changes['label']) {
      this.markerService.setLabel(this)
    }

    if (changes['longitude'] || changes['latitude']) {
      this.markerService.setPosition(this)
    }

    if (changes['visible']) {
      this.markerService.setVisible(this)
    }

    if (changes['zIndex']) {
      this.markerService.setZIndex(this)
    }

    if (changes['title']) {
      this.markerService.setTitle(this)
    }

    if (changes['options']) {
      this.markerService.setOptions(this)
    }
  }

  ngOnDestroy() {
    if (this.gMarker) {
      this.gMarker.setMap(null)
    }
    this.subs.forEach(item => item.unsubscribe())
  }

  private addEventListeners() {
    const events = [
      {name: 'click', event: this.markerClick },
      // {name: 'animation_changed', event: this.animationChanged },
      // {name: 'clickable_changed', event: this.clickableChanged },
      // {name: 'cursor_changed', event: this.cursorChanged },
      // {name: 'dblclick', event: this.dblclick },
      // {name: 'drag', event: this.dragend },
      // {name: 'dragend', event: this.dragend },
      // {name: 'dragstart', event: this.dragstart },
      // {name: 'draggable_changed', event: this.draggableChanged },
      // {name: 'flat_changed', event: this.flatChanged },
      // {name: 'icon_changed', event: this.iconChanged },
      // {name: 'mousedown', event: this.mousedown },
      // {name: 'mouseout', event: this.mousedout },
      // {name: 'mouseover', event: this.mousedover },
      // {name: 'mouseup', event: this.mouseup },
      // {name: 'rightclick', event: this.rightclick },
      // {name: 'position_changed', event: this.positionChanged },
      // {name: 'title_changed', event: this.titleChanged },
      // {name: 'visible_changed', event: this.visibleChanged },
      // {name: 'zindex_changed', event: this.zindexChanged },
    ]

    const subs = events.map(item => {
      return this.markerService.createEvent$(item.name, this)
        .subscribe(e => {
            item.event.emit(e)
        })
    })

    this.subs = this.subs.concat(subs)
  }
}
