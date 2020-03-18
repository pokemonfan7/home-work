import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  mapInitInfo = {
    lng: 104.07,
    lat: 30.67,
    zoom: 12,
  };

  markers = [];
  polygonPaths;

  constructor(
    private cdf: ChangeDetectorRef
  ) {
  }

  gMapClick(value) {
    this.markers.push({
      lat: value.event.latLng.lat(),
      lng: value.event.latLng.lng()
    });
    this.cdf.detectChanges();
  }

  gMapRightClick() {
    this.markersToPolygon(this.markers);
    this.markers = [];
    this.cdf.detectChanges();
  }

  markersToPolygon(markers) {
    let minLat, minLng, maxLat, maxLng;
    markers.forEach(marker => {
      if (!minLat) {
        minLat = marker.lat;
      } else if (marker.lat < minLat) {
        minLat = marker.lat;
      }

      if (!maxLat) {
        maxLat = marker.lat;
      } else if (marker.lat > maxLat) {
        maxLat = marker.lat;
      }

      if (!minLng) {
        minLng = marker.lng;
      } else if (marker.lng < minLng) {
        minLng = marker.lng;
      }

      if (!maxLng) {
        maxLng = marker.lng;
      } else if (marker.lng > maxLng) {
        maxLng = marker.lng;
      }
    });

    const rectangleCenter = { lat: (maxLat + minLat) / 2, lng: (maxLng + minLng) / 2 };

    markers.forEach(marker => {
      marker.angle = this.calcAngle(rectangleCenter, marker);
    });

    markers.sort((pre, next) => pre.angle - next.angle);

    this.polygonPaths = markers;
  }

  calcAngle(centerPoint, markerPoint) {
    // 计算两点间的角度
    const centerP = this.latLngToPoint(centerPoint);
    const markerP = this.latLngToPoint(markerPoint);
    const diffX = markerP.x - centerP.x;
    const diffY = markerP.y - centerP.y;
    return 180 * Math.atan2(diffY, diffX) / Math.PI;
  }

  // 将经纬度转换为世界坐标点
  private latLngToPoint(latLng) {
    const TILE_SIZE = 256;
    let siny = Math.sin(latLng.lat * Math.PI / 180);

    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return new google.maps.Point(
      TILE_SIZE * (0.5 + latLng.lng / 360),
      TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
  }
}
