import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YapperComponent } from './degrise.component';

describe('YapperComponent', () => {
  let component: YapperComponent;
  let fixture: ComponentFixture<YapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
