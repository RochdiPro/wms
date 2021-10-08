import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonRetourComponent } from './bon-retour.component';

describe('BonRetourComponent', () => {
  let component: BonRetourComponent;
  let fixture: ComponentFixture<BonRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonRetourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
