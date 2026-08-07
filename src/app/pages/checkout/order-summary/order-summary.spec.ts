import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSummary } from './order-summary';

describe('OrderSummary', () => {
  let component: OrderSummary;
  let fixture: ComponentFixture<OrderSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
