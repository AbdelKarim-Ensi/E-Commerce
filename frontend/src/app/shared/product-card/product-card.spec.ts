import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { Product } from '@models/product.model';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  const mockProduct: Product = {
    id: '1',
    name: 'Clavier mécanique',
    slug: 'clavier-mecanique',
    description: null,
    price: '199.99',
    stock: 5,
    isActive: true,
    attributes: null,
    imageUrl: null,
    thumbnailUrl: null,
    categoryId: 'cat-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProductCard] }).compileComponents();
    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect low stock', () => {
    expect(component.isLowStock).toBe(true);
  });

  it('should detect out of stock', () => {
    component.product = { ...mockProduct, stock: 0 };
    expect(component.isOutOfStock).toBe(true);
  });
});