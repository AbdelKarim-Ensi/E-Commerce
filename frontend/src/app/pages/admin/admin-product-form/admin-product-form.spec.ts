import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminProductForm } from './admin-product-form';
import { testProviders } from '../../../../test/test-providers';

describe('AdminProductForm', () => {
  let component: AdminProductForm;
  let fixture: ComponentFixture<AdminProductForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductForm],
      providers: [...testProviders, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});