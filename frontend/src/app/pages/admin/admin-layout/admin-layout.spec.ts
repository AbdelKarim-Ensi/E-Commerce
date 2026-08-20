import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AdminLayout } from './admin-layout';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';

describe('AdminLayout', () => {
  let component: AdminLayout;
  let fixture: ComponentFixture<AdminLayout>;

  const mockAdminUser: User = {
    id: '1',
    email: 'admin@techgear.com',
    firstName: 'Abdel',
    lastName: 'Karim',
    phone: null,
    address: null,
    role: 'ADMIN',
    createdAt: '',
    updatedAt: '',
  };

  beforeEach(async () => {
    const authServiceMock = {
      currentUser: signal<User | null>(mockAdminUser),
    };

    await TestBed.configureTestingModule({
      imports: [AdminLayout],
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current user full name', () => {
    expect(component.currentUserName).toBe('Abdel Karim');
  });

  it('should display the current user role', () => {
    expect(component.currentUserRole).toBe('ADMIN');
  });
});