import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonRejetComponent } from './bon-rejet.component';

describe('BonRejetComponent', () => {
  let component: BonRejetComponent;
  let fixture: ComponentFixture<BonRejetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonRejetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonRejetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
