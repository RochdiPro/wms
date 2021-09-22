import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerBonSortieComponent } from './lister-bon-sortie.component';

describe('ListerBonSortieComponent', () => {
  let component: ListerBonSortieComponent;
  let fixture: ComponentFixture<ListerBonSortieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerBonSortieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerBonSortieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
