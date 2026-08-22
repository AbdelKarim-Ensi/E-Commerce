import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminCategories } from './admin-categories';
import { testProviders } from '../../../../test/test-providers';

describe('AdminCategories', () => {
  let component: AdminCategories;
  let fixture: ComponentFixture<AdminCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategories],
      providers: [...testProviders, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});