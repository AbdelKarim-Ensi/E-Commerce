import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductForm } from './admin-product-form';

describe('AdminProductForm', () => {
  let component: AdminProductForm;
  let fixture: ComponentFixture<AdminProductForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
