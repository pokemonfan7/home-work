import { Inject, Injectable, InjectionToken } from '@angular/core'
import { MapLoader } from './loader.interface'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter } from 'rxjs/operators'

export const LAZY_MAPS_API_CONFIG = new InjectionToken('ngx google map config')

export interface LazyMapLoaderConfig {
  /**
   * The Google Maps API Key (see:
   * https://developers.google.com/maps/documentation/javascript/get-api-key)
   */
  apiKey?: string;

  /**
   * The Google Maps client ID (for premium plans).
   * When you have a Google Maps APIs Premium Plan license, you must authenticate
   * your application with either an API key or a client ID.
   * The Google Maps API will fail to load if both a client ID and an API key are included.
   */
  clientId?: string;

  /**
   * The Google Maps channel name (for premium plans).
   * A channel parameter is an optional parameter that allows you to track usage under your client
   * ID by assigning a distinct channel to each of your applications.
   */
  channel?: string;

  /**
   * Google Maps API version.
   */
  apiVersion?: string;

  /**
   * Host and Path used for the `<script>` tag.
   */
  hostAndPath?: string;

  /**
   * Defines which Google Maps libraries should get loaded.
   */
  libraries?: string[];

  /**
   * The default bias for the map behavior is US.
   * If you wish to alter your application to serve different map tiles or bias the
   * application, you can overwrite the default behavior (US) by defining a `region`.
   * See https://developers.google.com/maps/documentation/javascript/basics#Region
   */
  region?: string;

  /**
   * The Google Maps API uses the browser's preferred language when displaying
   * textual information. If you wish to overwrite this behavior and force the API
   * to use a given language, you can use this setting.
   * See https://developers.google.com/maps/documentation/javascript/basics#Language
   */
  language?: string;
}

@Injectable()
export class LazyMapLoaderService implements MapLoader {
  private mapLoader$: BehaviorSubject<boolean>
  constructor(
    @Inject(LAZY_MAPS_API_CONFIG) private config: LazyMapLoaderConfig,
  ) {}

  load(): Observable<boolean> {
    if (this.mapLoader$) {
      return this.mapLoader$
    }
    this.mapLoader$ = new BehaviorSubject(false)
    if (window['google']) {
      this.mapLoader$.next(true)
      return this.mapLoader$
    }
    const script = document.createElement<'script'>('script')
    script.type = 'text/javascript'
    script.async = true
    script.defer = true
    script.src = this.buildReqUrl()
    script.onload = () => {
      this.mapLoader$.next(true)
    }
    script.onerror = (err) => {
      this.mapLoader$.error(err)
    }
    document.body.appendChild(script)

    return this.mapLoader$.pipe(
      filter(item => !!item)
    )
  }

  private buildReqUrl(): string {
    const hostStr = 'maps.googleapis.com/maps/api/js'
    const protocol = document.location.protocol === 'https:' ? 'https:' : 'http:'
    const query = {
      v: this.config.apiVersion || '3',
      key: this.config.apiKey,
      client: this.config.clientId,
      channel: this.config.channel,
      libraries: this.config.libraries,
      region: this.config.region,
      language: this.config.language
    }
    const params = Object.keys(query)
      .filter((k) => query[k])
      .filter((k) => {
        // filter empty arrays
        return !Array.isArray(query[k]) || (Array.isArray(query[k]) && query[k].length > 0)
      })
      .map((k) => {
        const value = query[k]
        if (Array.isArray(value)) {
          return { key: k, value: value.join(',')}
        }

        return { key: k, value}
      })
      .map(({key, value}) => {
        return `${key}=${value}`
      }).join('&')

    return `${protocol}//${hostStr}?${params}`
  }
}
