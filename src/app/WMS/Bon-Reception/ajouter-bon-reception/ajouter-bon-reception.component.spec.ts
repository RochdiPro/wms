import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBonReceptionComponent } from './ajouter-bon-reception.component';

describe('AjouterBonReceptionComponent', () => {
  let component: AjouterBonReceptionComponent;
  let fixture: ComponentFixture<AjouterBonReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterBonReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterBonReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
