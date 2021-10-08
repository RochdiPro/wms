import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerBonRetourComponent } from './lister-bon-retour.component';

describe('ListerBonRetourComponent', () => {
  let component: ListerBonRetourComponent;
  let fixture: ComponentFixture<ListerBonRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerBonRetourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerBonRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
