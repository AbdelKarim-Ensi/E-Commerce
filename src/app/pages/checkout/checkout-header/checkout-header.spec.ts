import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutHeader } from './checkout-header';

describe('CheckoutHeader', () => {
  let component: CheckoutHeader;
  let fixture: ComponentFixture<CheckoutHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
