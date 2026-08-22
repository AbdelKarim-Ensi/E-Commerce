import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminNewsletter } from './admin-newsletter';
import { testProviders } from '../../../../test/test-providers';

describe('AdminNewsletter', () => {
  let component: AdminNewsletter;
  let fixture: ComponentFixture<AdminNewsletter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewsletter],
      providers: [...testProviders, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNewsletter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});