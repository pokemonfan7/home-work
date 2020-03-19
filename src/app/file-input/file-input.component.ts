import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as shapefile from 'shapefile';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.less']
})
export class FileInputComponent implements OnInit {
  @Output() geoJsonReady = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  selectShpFile(e) {
    const shpFile = e.srcElement.files[0];
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(shpFile);
    fileReader.onload = (event) => {
      const result = event.target.result;
      shapefile.read(result).then(geoJson => {
        this.geoJsonReady.emit(geoJson)
      });
    };
  }
}
