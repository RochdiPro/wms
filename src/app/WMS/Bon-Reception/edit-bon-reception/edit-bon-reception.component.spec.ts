import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBonReceptionComponent } from './edit-bon-reception.component';

describe('EditBonReceptionComponent', () => {
  let component: EditBonReceptionComponent;
  let fixture: ComponentFixture<EditBonReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBonReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBonReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
