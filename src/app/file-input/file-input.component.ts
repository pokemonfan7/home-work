import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import * as shapefile from 'shapefile';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.less']
})
export class FileInputComponent implements OnInit {
  @Output() geoJsonReady = new EventEmitter();

  constructor(
    private messageService: NzMessageService,
  ) { }

  ngOnInit() {
  }

  selectShpFile(e) {
    const shpFile = e.srcElement.files[0];
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(shpFile);
    fileReader.onload = (event: any) => {
      const result = event.target.result;
      shapefile.read(result)
      .then(geoJson => {
        this.geoJsonReady.emit(geoJson);
      })
      .catch(() => {
        this.messageService.error('file read error');
      });
    };
  }
}
