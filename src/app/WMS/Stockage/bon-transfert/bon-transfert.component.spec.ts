import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonTransfertComponent } from './bon-transfert.component';

describe('BonTransfertComponent', () => {
  let component: BonTransfertComponent;
  let fixture: ComponentFixture<BonTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonTransfertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
