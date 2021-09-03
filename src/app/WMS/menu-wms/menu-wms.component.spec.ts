import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuWmsComponent } from './menu-wms.component';

describe('MenuWmsComponent', () => {
  let component: MenuWmsComponent;
  let fixture: ComponentFixture<MenuWmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuWmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuWmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
