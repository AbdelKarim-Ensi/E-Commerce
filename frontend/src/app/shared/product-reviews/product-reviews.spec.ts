import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductReviews } from './product-reviews';
import { testProviders } from '../../../test/test-providers';

describe('ProductReviews', () => {
  let component: ProductReviews;
  let fixture: ComponentFixture<ProductReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReviews],
      providers: [...testProviders, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductReviews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});