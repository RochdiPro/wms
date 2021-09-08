import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierBonReceptionComponent } from './modifier-bon-reception.component';

describe('ModifierBonReceptionComponent', () => {
  let component: ModifierBonReceptionComponent;
  let fixture: ComponentFixture<ModifierBonReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierBonReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierBonReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
