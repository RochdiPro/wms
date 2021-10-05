import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerBonTransfertComponent } from './lister-bon-transfert.component';

describe('ListerBonTransfertComponent', () => {
  let component: ListerBonTransfertComponent;
  let fixture: ComponentFixture<ListerBonTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerBonTransfertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerBonTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
