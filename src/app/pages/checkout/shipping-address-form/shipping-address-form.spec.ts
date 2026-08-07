import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddressForm } from './shipping-address-form';

describe('ShippingAddressForm', () => {
  let component: ShippingAddressForm;
  let fixture: ComponentFixture<ShippingAddressForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingAddressForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingAddressForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
