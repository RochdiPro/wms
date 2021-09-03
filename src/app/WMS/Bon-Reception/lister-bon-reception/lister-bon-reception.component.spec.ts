import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerBonReceptionComponent } from './lister-bon-reception.component';

describe('ListerBonReceptionComponent', () => {
  let component: ListerBonReceptionComponent;
  let fixture: ComponentFixture<ListerBonReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerBonReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerBonReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
