import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutStepper } from './checkout-stepper';

describe('CheckoutStepper', () => {
  let component: CheckoutStepper;
  let fixture: ComponentFixture<CheckoutStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutStepper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutStepper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
