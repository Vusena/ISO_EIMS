import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftsGivenOutComponent } from './gifts-given-out.component';

describe('GiftsGivenOutComponent', () => {
  let component: GiftsGivenOutComponent;
  let fixture: ComponentFixture<GiftsGivenOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftsGivenOutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftsGivenOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
