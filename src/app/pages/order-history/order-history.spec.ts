// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { of, throwError } from 'rxjs';
// import { OrderHistory } from './order-history';
// import { OrdersService } from '@services/orders.service';
// import { Order } from '@models/order.model';

// describe('OrderHistory', () => {
//   let component: OrderHistory;
//   let fixture: ComponentFixture<OrderHistory>;
//   let ordersServiceSpy: jasmine.SpyObj<OrdersService>;

//   const mockOrders: Order[] = [
//     {
//       id: '9b261862-02f4-4c31-9ef7-a33f212256c7',
//       userId: '10eb2a99-07bc-41d2-a090-a41b1b8c',
//       status: 'DELIVERED',
//       totalAmount: '3598',
//       shippingAddress: 'abdel karim Doudey, OPT',
//       stripePaymentIntentId: null,
//       items: [
//         {
//           id: 'fa9ce32e-c8cf-457b-a93c-ffce',
//           orderId: '9b261862-02f4-4c31-9ef7-a33f212256c7',
//           productId: 'a71a7a6c-2c2b-484c-ab',
//           quantity: 2,
//           unitPrice: '1799',
//         },
//       ],
//       createdAt: '2026-08-10T10:00:21.071Z',
//       updatedAt: '2026-08-10T10:00:21.071Z',
//     },
//   ];

//   beforeEach(async () => {
//     ordersServiceSpy = jasmine.createSpyObj('OrdersService', ['getAll']);

//     await TestBed.configureTestingModule({
//       imports: [OrderHistory],
//       providers: [{ provide: OrdersService, useValue: ordersServiceSpy }],
//     }).compileComponents();

//     fixture = TestBed.createComponent(OrderHistory);
//     component = fixture.componentInstance;
//   });

//   it('should create', () => {
//     ordersServiceSpy.getAll.and.returnValue(of([]));
//     fixture.detectChanges();
//     expect(component).toBeTruthy();
//   });

//   it('should load orders on init', () => {
//     ordersServiceSpy.getAll.and.returnValue(of(mockOrders));
//     fixture.detectChanges();

//     expect(component.orders()).toEqual(mockOrders);
//     expect(component.loading()).toBe(false);
//     expect(component.error()).toBeNull();
//   });

//   it('should set error state when getAll fails', () => {
//     ordersServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));
//     fixture.detectChanges();

//     expect(component.error()).toBe('Impossible de charger vos commandes. Veuillez réessayer.');
//     expect(component.loading()).toBe(false);
//     expect(component.orders()).toEqual([]);
//   });

//   it('should show empty state when orders list is empty', () => {
//     ordersServiceSpy.getAll.and.returnValue(of([]));
//     fixture.detectChanges();

//     expect(component.orders().length).toBe(0);
//   });

//   it('should parse decimal string prices correctly', () => {
//     expect(component.parsePrice('3598')).toBe(3598);
//     expect(component.parsePrice('1249.50')).toBe(1249.5);
//   });

//   it('should compute total item count across items', () => {
//     expect(component.itemCount(mockOrders[0])).toBe(2);
//   });

//   it('should map status codes to French labels', () => {
//     expect(component.statusLabel('PENDING')).toBe('En attente');
//     expect(component.statusLabel('PAID')).toBe('Payée');
//     expect(component.statusLabel('SHIPPED')).toBe('Expédiée');
//     expect(component.statusLabel('DELIVERED')).toBe('Livrée');
//     expect(component.statusLabel('CANCELLED')).toBe('Annulée');
//   });

//   it('should call loadOrders again on retry', () => {
//     ordersServiceSpy.getAll.and.returnValue(throwError(() => new Error('fail')));
//     fixture.detectChanges();

//     ordersServiceSpy.getAll.and.returnValue(of(mockOrders));
//     component.loadOrders();

//     expect(component.orders()).toEqual(mockOrders);
//     expect(component.error()).toBeNull();
//   });
// });