import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosureComponent } from './closure.component';

describe('ClosureComponent', () => {
  let component: ClosureComponent;
  let fixture: ComponentFixture<ClosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
