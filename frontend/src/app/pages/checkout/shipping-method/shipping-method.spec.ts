import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShippingMethod } from './shipping-method';
import { SHIPPING_OPTIONS } from '../../../core/services/checkout.service';

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
    component.selected = SHIPPING_OPTIONS[0];
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});