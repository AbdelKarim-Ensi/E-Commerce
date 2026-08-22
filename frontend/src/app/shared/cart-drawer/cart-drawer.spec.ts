import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { CartDrawer } from './cart-drawer';
import { CartItem } from '../../core/models/cartItem.model';
import { Product } from '../../core/models/product.model';

describe('CartDrawer', () => {
  let component: CartDrawer;
  let fixture: ComponentFixture<CartDrawer>;
  let router: Router;

  const mockProduct = {
    id: '1',
    name: 'Clavier mécanique',
    slug: 'clavier-mecanique',
    description: null,
    price: '199.99',
    stock: 5,
    isActive: true,
    isFeatured: false,
    brand: null,
    attributes: null,
    imageUrl: null,
    thumbnailUrl: null,
    categoryId: 'cat-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: null,
    reviewsCount: null,
  } as unknown as Product;

  const mockItems: CartItem[] = [{ product: mockProduct, quantity: 2 }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDrawer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CartDrawer);
    component = fixture.componentInstance;
    component.items = mockItems;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute total item count from quantities', () => {
    expect(component.totalCount).toBe(2);
  });

  it('should compute line total for an item', () => {
    expect(component.lineTotal(mockItems[0])).toBeCloseTo(399.98);
  });

  it('should emit close and navigate to checkout', () => {
    vi.spyOn(component.close, 'emit');
    component.goToCheckout();
    expect(component.close.emit).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/checkout']);
  });
});