import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Mocked, vi } from 'vitest';
import { ProductCard } from './product-card';
import { CartService } from '../../core/services/cart.service';
import { ShowcaseService } from '../../core/services/showcase.service';
import { Product } from '../../core/models/product.model';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;
  let cartServiceMock: Mocked<CartService>;
  let showcaseServiceMock: Mocked<ShowcaseService>;
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

  beforeEach(async () => {
    cartServiceMock = {
      isWishlisted: vi.fn(),
      toggleWishlist: vi.fn(),
    } as unknown as Mocked<CartService>;
    showcaseServiceMock = {
      setProduct: vi.fn(),
    } as unknown as Mocked<ShowcaseService>;
    cartServiceMock.isWishlisted.mockReturnValue(false);

    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: cartServiceMock },
        { provide: ShowcaseService, useValue: showcaseServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    component.product = mockProduct;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect wishlisted state from CartService', () => {
    expect(component.wishlisted).toBe(false);
    cartServiceMock.isWishlisted.mockReturnValue(true);
    expect(component.wishlisted).toBe(true);
  });

  it('should navigate to product detail on card click', () => {
    component.onCardClick();
    expect(showcaseServiceMock.setProduct).toHaveBeenCalledWith(mockProduct);
    expect(router.navigate).toHaveBeenCalledWith(['/products', '1']);
  });

  it('should toggle wishlist and stop event propagation on wishlist click', () => {
    const event = new MouseEvent('click');
    vi.spyOn(event, 'stopPropagation');
    component.onWishlistClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(cartServiceMock.toggleWishlist).toHaveBeenCalledWith('1');
  });

  it('should emit addToCart on cart click without calling CartService directly', () => {
    const event = new MouseEvent('click');
    vi.spyOn(event, 'stopPropagation');
    vi.spyOn(component.addToCart, 'emit');

    component.onCartClick(event);

    expect(event.stopPropagation).toHaveBeenCalled();
   
    expect(component.addToCart.emit).toHaveBeenCalledWith(mockProduct);
  });
});