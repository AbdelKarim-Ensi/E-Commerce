import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethod } from './payment-method';

describe('PaymentMethod', () => {
  let component: PaymentMethod;
  let fixture: ComponentFixture<PaymentMethod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethod]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethod);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
