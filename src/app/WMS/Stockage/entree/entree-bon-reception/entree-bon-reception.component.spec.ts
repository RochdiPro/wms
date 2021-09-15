import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreeBonReceptionComponent } from './entree-bon-reception.component';

describe('EntreeBonReceptionComponent', () => {
  let component: EntreeBonReceptionComponent;
  let fixture: ComponentFixture<EntreeBonReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntreeBonReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntreeBonReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
