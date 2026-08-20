import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartDrawer } from './cart-drawer';
import { CartItem } from '@models/cartItem.model';
import { Product } from '@models/product.model';

describe('CartDrawer', () => {
  let component: CartDrawer;
  let fixture: ComponentFixture<CartDrawer>;

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

  const mockItems: CartItem[] = [{ product: mockProduct, quantity: 2 }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDrawer]
    }).compileComponents();

    fixture = TestBed.createComponent(CartDrawer);
    component = fixture.componentInstance;
    component.items = mockItems;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute subtotal correctly', () => {
    expect(component.subtotal).toBeCloseTo(399.98);
  });

  it('should apply free shipping above threshold', () => {
    component.items = [{ product: { ...mockProduct, price: '60' }, quantity: 1 }];
    expect(component.shipping).toBe(0);
  });
});