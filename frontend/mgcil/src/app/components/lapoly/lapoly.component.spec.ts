import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LapolyComponent } from './lapoly.component';

describe('LapolyComponent', () => {
  let component: LapolyComponent;
  let fixture: ComponentFixture<LapolyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LapolyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LapolyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
