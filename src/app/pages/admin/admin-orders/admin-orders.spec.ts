import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminOrders } from './admin-orders';

describe('AdminOrders', () => {
  let component: AdminOrders;
  let fixture: ComponentFixture<AdminOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrders, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});