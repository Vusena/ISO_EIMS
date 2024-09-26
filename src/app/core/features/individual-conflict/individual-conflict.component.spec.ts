import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualConflictComponent } from './individual-conflict.component';

describe('IndividualConflictComponent', () => {
  let component: IndividualConflictComponent;
  let fixture: ComponentFixture<IndividualConflictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualConflictComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndividualConflictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
