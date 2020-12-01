import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySingleComponent } from './community-single.component';

describe('CommunitySingleComponent', () => {
  let component: CommunitySingleComponent;
  let fixture: ComponentFixture<CommunitySingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitySingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
