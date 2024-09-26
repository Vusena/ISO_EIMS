import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupConflictComponent } from './group-conflict.component';

describe('GroupConflictComponent', () => {
  let component: GroupConflictComponent;
  let fixture: ComponentFixture<GroupConflictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupConflictComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupConflictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
