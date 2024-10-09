import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacoteqComponent } from './tacoteq.component';

describe('TacoteqComponent', () => {
  let component: TacoteqComponent;
  let fixture: ComponentFixture<TacoteqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacoteqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TacoteqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
