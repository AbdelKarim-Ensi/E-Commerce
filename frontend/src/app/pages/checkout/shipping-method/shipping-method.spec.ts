import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingMethod } from './shipping-method';

describe('ShippingMethod', () => {
  let component: ShippingMethod;
  let fixture: ComponentFixture<ShippingMethod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingMethod]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingMethod);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
