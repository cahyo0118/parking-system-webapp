import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantSingleComponent } from './tenant-single.component';

describe('TenantSingleComponent', () => {
  let component: TenantSingleComponent;
  let fixture: ComponentFixture<TenantSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
