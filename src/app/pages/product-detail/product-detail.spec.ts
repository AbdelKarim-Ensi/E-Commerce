import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetail } from './product-detail';
import { Product } from '@models/product.model';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;

  const mockProduct: Product = {
    id: '1',
    name: 'Clavier mécanique',
    slug: 'clavier-mecanique',
    description: 'Un super clavier',
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
    await TestBed.configureTestingModule({ imports: [ProductDetail] }).compileComponents();
    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    component.product = mockProduct;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fallback to product image when no gallery', () => {
    expect(component.images.length).toBe(1);
  });
});