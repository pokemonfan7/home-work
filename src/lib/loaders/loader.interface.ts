import { Observable } from 'rxjs'

export interface MapLoader {
  load(): Observable<boolean>
}
