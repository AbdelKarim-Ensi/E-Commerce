import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutFooter } from './checkout-footer';

describe('CheckoutFooter', () => {
  let component: CheckoutFooter;
  let fixture: ComponentFixture<CheckoutFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
