import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntergrityAwardAdminComponent } from './intergrity-award-admin.component';

describe('IntergrityAwardAdminComponent', () => {
  let component: IntergrityAwardAdminComponent;
  let fixture: ComponentFixture<IntergrityAwardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntergrityAwardAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntergrityAwardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
