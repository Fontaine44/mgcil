import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoltComponent } from './bolt.component';

describe('BoltComponent', () => {
  let component: BoltComponent;
  let fixture: ComponentFixture<BoltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
