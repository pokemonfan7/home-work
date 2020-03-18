import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone, OnChanges, OnDestroy,
    Output, SimpleChanges
} from '@angular/core'
import { GMapMapService } from '../../services/gmap-map.service'
import { LazyMapLoaderService } from '../../loaders/lazy-loader.service'
import { map, take } from 'rxjs/operators'
import { Subscription } from 'rxjs'

type MapTypeControlOptions = google.maps.MapTypeControlOptions
type PanControlOptions = google.maps.PanControlOptions
type ZoomControlOptions = google.maps.ZoomControlOptions
type StreetViewControlOptions = google.maps.StreetViewControlOptions
type MapTypeId = google.maps.MapTypeId
type FullscreenControlOptions = google.maps.FullscreenControlOptions


let mapId = 0

export interface PanToBoundsModal {
    bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
    padding?: number | google.maps.Padding
}

@Component({
    selector: 'gmap-map',
    templateUrl: './gmap-map.component.html',
    styleUrls: ['./gmap-map.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GMapMapComponent implements AfterViewInit, OnChanges, OnDestroy {
    /**
     * The longitude that defines the center of the map.
     */
    @Input() longitude = 0

    /**
     * The latitude that defines the center of the map.
     */
    @Input() latitude = 0

    /**
     * The zoom of the map, The default is 8
     */
    @Input() zoom = 8

    /**
     * the minimal zoom level
     */
    @Input() minZoom = 2

    /**
     * the max zoom
     */
    @Input() maxZoom = 22

    /**
     * Enables/disables if map is draggable
     */
    @Input() draggable = true

    /**
     * Options for the zoom control
     */
    @Input() zoomControl = true

    /**
     * Changes the center of the map by the given distance in pixels.
     */
    @Input() panByX: number

    /**
     * Changes the center of the map by the given distance in pixels.
     */
    @Input() panByY: number

    /**
     * The initial enabled/disabled state of the Scale control. This is disabled by default.
     */
    @Input() scaleControl = false

    /**
     * Color used for the background of the Map div. This color will be visible when tiles have not yet loaded as the user pans.
     * This option can only be set when the map is initialized.
     */
    @Input() backgroundColor: string

    /**
     * When false, map icons are not clickable. A map icon represents a point of interest, also known as a POI.
     * By default map icons are clickable.
     */
    @Input() clickableIcons = true

    /**
     * Enables/disables zoom and center on double click. Enabled by default.
     * Note: This property is not recommended. To disable zooming on double click,
     * you can use the gestureHandling property, and set it to "none".
     */
    @Input() disableDoubleClickZoom = true

    /**
     * The enabled/disabled state of the Fullscreen control.
     */
    @Input() fullscreenControl = true

    /**
     * all options see: https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
     */
    @Input() otherOptions: google.maps.MapOptions

    @Input() latLngBounds: PanToBoundsModal

    @Input() mapTypeControlOptions: MapTypeControlOptions

    @Input() panControlOptions: PanControlOptions

    @Input() zoomControlOptions: ZoomControlOptions

    @Input() mapTypeId: MapTypeId

    @Input() fullscreenControlOptions: FullscreenControlOptions

    @Input() streetViewControlOptions: StreetViewControlOptions

    @Output() mapInit = new EventEmitter<google.maps.Map>()

    /**
     * This event is fired when the viewport bounds have changed.
     */
    @Output() boundsChange = new EventEmitter()

    @Output() centerChanged = new EventEmitter()

    @Output() mapClick = new EventEmitter<google.maps.MouseEvent | google.maps.IconMouseEvent>()

    @Output() dbClick = new EventEmitter<google.maps.MouseEvent>()

    @Output() drag = new EventEmitter()

    @Output() dragend = new EventEmitter()

    @Output() dragstart = new EventEmitter()

    @Output() headingChanged = new EventEmitter()

    @Output() idle = new EventEmitter()

    @Output() maptypeIdChanged = new EventEmitter()

    @Output() mouseMove = new EventEmitter()

    @Output() mouseOut = new EventEmitter()

    @Output() mouseOver = new EventEmitter()

    @Output() projectionChanged = new EventEmitter()

    @Output() rightClick = new EventEmitter<google.maps.MouseEvent>()

    @Output() tilesLoaded = new EventEmitter()

    @Output() tiltChanged = new EventEmitter()

    @Output() zoomChanged = new EventEmitter()

    mapId: string
    gMap: google.maps.Map

    private subs: Subscription[] = []

    constructor(
        private elemRef: ElementRef,
        private mapService: GMapMapService,
        private ngZone: NgZone,
        private cdf: ChangeDetectorRef,
        private lazyLoader: LazyMapLoaderService,
    ) {
        this.mapId = this.uniqueMapId()
    }

    ngAfterViewInit() {
        const mapContainerElem = this.elemRef.nativeElement.querySelector(`#${this.mapId}`)

        this.lazyLoader.load().pipe(
            take(1),
            map(() => {
                return this.mapService.createMap(mapContainerElem, this)
            })
        ).subscribe(gmap => {
            this.ngZone.run(() => {
                this.gMap = gmap
                this.mapInit.emit(gmap)
                this.mapInit.complete()
                this.cdf.detectChanges()

                this.addEventListeners()
            })
        })
    }

    fitBounds(points: google.maps.LatLngLiteral[], minZoom?, maxZoom?) {
        if (!points || points.length === 0) {
            return
        }
        this.ngZone.runOutsideAngular(() => {
            const bounds = new google.maps.LatLngBounds()
            points.forEach(item => {
                bounds.extend(item)
            })

            if (this.minZoom) {
                this.gMap.setOptions({minZoom})
            }
            if (this.maxZoom) {
                this.gMap.setOptions({maxZoom})
            }

            this.gMap.fitBounds(bounds)

            this.gMap.setOptions({
                minZoom: this.minZoom,
                maxZoom: this.maxZoom
            })
        })
    }

    fitBoundsByBounds(bounds: google.maps.LatLngBounds, minZoom?, maxZoom?) {
        this.ngZone.runOutsideAngular(() => {
            if (this.minZoom) {
                this.gMap.setOptions({minZoom})
            }
            if (this.maxZoom) {
                this.gMap.setOptions({maxZoom})
            }

            this.gMap.fitBounds(bounds)

            this.gMap.setOptions({
                minZoom: this.minZoom,
                maxZoom: this.maxZoom
            })
        })
    }

    panBy(x: number, y = 0) {
        this.ngZone.runOutsideAngular(() => {
            this.gMap.panBy(x, y)
        })
    }

    setZoom(zoom) {
        this.ngZone.runOutsideAngular(() => {
            this.gMap.setZoom(zoom)
        })
    }

    setCenter(center) {
        this.ngZone.runOutsideAngular(() => {
            this.gMap.setCenter(center)
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.gMap) {
            return
        }

        if (changes['latitude'] || changes['longitude']) {
            this.setCenter({
                lat: this.latitude,
                lng: this.longitude
            })
        }

        if (changes['panByX'] || changes['panByY']) {
            this.ngZone.runOutsideAngular(() => {
                this.gMap.panBy(this.panByX || 0, this.panByY || 0)
            })
        }

        if (changes['latLngBounds']) {
            this.ngZone.runOutsideAngular(() => {
                this.gMap.panToBounds(this.latLngBounds.bounds, this.latLngBounds.padding)
            })
        }

        if (changes['otherOptions']) {
            this.ngZone.runOutsideAngular(() => {
                this.gMap.setOptions(this.otherOptions)
            })
        }

        if (changes['zoom']) {
            this.setZoom(this.zoom)
        }
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.forEach(item => item.unsubscribe())
        }
    }

    private uniqueMapId() {
        return 'dt_map_id_' + mapId++
    }

    private addEventListeners() {
        const events = [
            {name: 'bounds_changed', event: this.boundsChange},
            {name: 'click', event: this.mapClick},
            {name: 'dblclick', event: this.dbClick},
            {name: 'drag', event: this.drag},
            {name: 'dragend', event: this.dragend},
            {name: 'dragstart', event: this.dragstart},
            {name: 'heading_changed', event: this.headingChanged},
            {name: 'idle', event: this.idle},
            {name: 'maptypeid_changed', event: this.maptypeIdChanged},
            {name: 'mousemove', event: this.mouseMove},
            {name: 'mouseout', event: this.mouseOut},
            {name: 'mouseover', event: this.mouseOver},
            {name: 'projection_changed', event: this.projectionChanged},
            {name: 'rightclick', event: this.rightClick},
            {name: 'tilesloaded', event: this.tilesLoaded},
            {name: 'tilt_changed', event: this.tiltChanged},
        ]

        const subs = events.map(item => {
            return this.mapService.createEvent$(item.name, this)
                .subscribe(e => item.event.emit(e))
        })

        this.subs.push(...subs)

        const streetView = this.gMap.getStreetView()
        google.maps.event.addListener(streetView, 'visible_changed', () => {
            if (streetView.getVisible()) {
                streetView.setOptions({
                    addressControlOptions: {
                        position: google.maps.ControlPosition.BOTTOM_CENTER
                    }
                })
            }
        })
    }
}
