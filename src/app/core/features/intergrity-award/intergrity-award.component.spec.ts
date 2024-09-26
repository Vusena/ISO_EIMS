import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntergrityAwardComponent } from './intergrity-award.component';

describe('IntergrityAwardComponent', () => {
  let component: IntergrityAwardComponent;
  let fixture: ComponentFixture<IntergrityAwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntergrityAwardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntergrityAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
