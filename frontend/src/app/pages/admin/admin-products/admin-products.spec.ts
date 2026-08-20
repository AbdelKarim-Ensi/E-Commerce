// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { provideRouter } from '@angular/router';
// import { of } from 'rxjs';
// import { AdminProducts } from './admin-products';
// import { ProductsService, PaginatedProducts } from '@services/products.service';

// describe('AdminProducts', () => {
//   let component: AdminProducts;
//   let fixture: ComponentFixture<AdminProducts>;
//   let productsServiceSpy: jasmine.SpyObj<ProductsService>;

//   const mockResponse: PaginatedProducts = {
//     data: [
//       {
//         id: '1',
//         name: 'iPhone 15 Pro',
//         slug: 'iphone-15-pro',
//         description: null,
//         price: '1799',
//         stock: 10,
//         isActive: true,
//         isFeatured: false,
//         brand: 'Apple',
//         attributes: null,
//         imageUrl: null,
//         thumbnailUrl: null,
//         categoryId: 'cat-1',
//         createdAt: '',
//         updatedAt: '',
//         rating: null,
//         reviewsCount: null,
//       } as any,
//     ],
//     total: 1,
//     page: 1,
//     limit: 20,
//   };

//   beforeEach(async () => {
//     productsServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll']);
//     productsServiceSpy.getAll.and.returnValue(of(mockResponse));

//     await TestBed.configureTestingModule({
//       imports: [AdminProducts],
//       providers: [provideRouter([]), { provide: ProductsService, useValue: productsServiceSpy }],
//     }).compileComponents();

//     fixture = TestBed.createComponent(AdminProducts);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load products on init', () => {
//     expect(component.products().length).toBe(1);
//     expect(component.loading()).toBe(false);
//   });

//   it('should parse decimal price string', () => {
//     expect(component.parsePrice('1799')).toBe(1799);
//   });
// // });