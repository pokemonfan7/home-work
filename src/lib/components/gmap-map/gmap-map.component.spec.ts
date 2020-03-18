import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GMapMapComponent } from './gmap-map.component'

describe('GMapMapComponent', () => {
  let component: GMapMapComponent
  let fixture: ComponentFixture<GMapMapComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GMapMapComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GMapMapComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
