import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  @ViewChild('mapComponent', {static: true}) mapComponent;
  mapInitInfo = {
    lng: 104.07,
    lat: 30.67,
    zoom: 12,
  };
  polygonFillColor = '#fafafa';

  markers = [];
  polygonPaths;

  constructor(
    private cdf: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {
  }

  gMapClick(target) {
    this.markers = this.markers.concat([{
      lat: target.event.latLng.lat(),
      lng: target.event.latLng.lng()
    }]);
    this.cdf.detectChanges();
  }

  gMapRightClick() {
    this.markersToPolygon(this.markers);
    this.markers = [];
    this.cdf.detectChanges();
  }

  listItemClick(e) {
    if (e.target.tagName === 'LI') {
      const index = e.target.id.slice(e.target.id.length - 1);
      this.mapComponent.setCenter(this.markers[index]);
    }
  }

  changePolygonFillColor() {
    this.polygonFillColor = '#545454';
  }

  markersToPolygon(markers) {
    if (markers.length < 3) {
      return this.messageService.warning('Drawing a polygon requires 3 or more points');
    }
    let minLat;
    let minLng;
    let maxLat;
    let maxLng;
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

    // 包含所有marker的矩形的中心点
    const rectangleCenter = { lat: (maxLat + minLat) / 2, lng: (maxLng + minLng) / 2 };

    // 计算每个marker和中心点的角度
    markers.forEach(marker => {
      marker.angle = this.calcAngle(rectangleCenter, marker);
    });

    // 按角度大小排序，构成polygon的路径
    markers.sort((pre, next) => pre.angle - next.angle);

    this.polygonPaths = markers;
  }

  // 计算两点间的角度
  private calcAngle(centerPoint, markerPoint) {
    const centerP = this.latLngToPoint(centerPoint);
    const markerP = this.latLngToPoint(markerPoint);
    const diffX = markerP.x - centerP.x;
    const diffY = markerP.y - centerP.y;
    return 180 * Math.atan2(diffY, diffX) / Math.PI;
  }

  // 将经纬度转换为世界坐标点，方法来自谷歌地图文档
  private latLngToPoint(latLng) {
    const TILE_SIZE = 256;
    let siny = Math.sin(latLng.lat * Math.PI / 180);

    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return new google.maps.Point(
      TILE_SIZE * (0.5 + latLng.lng / 360),
      TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
  }
}
