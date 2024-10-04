import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgorComponent } from './igor.component';

describe('IgorComponent', () => {
  let component: IgorComponent;
  let fixture: ComponentFixture<IgorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IgorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IgorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
