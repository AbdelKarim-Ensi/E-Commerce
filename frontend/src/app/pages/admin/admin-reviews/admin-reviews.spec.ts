import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminReviews } from './admin-reviews';
import { testProviders } from '../../../../test/test-providers';

describe('AdminReviews', () => {
  let component: AdminReviews;
  let fixture: ComponentFixture<AdminReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReviews],
      providers: [...testProviders, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReviews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});