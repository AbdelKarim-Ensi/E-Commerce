import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VerifyEmail } from './verify-email';
import { testProviders } from '../../../test/test-providers';

describe('VerifyEmail', () => {
  let component: VerifyEmail;
  let fixture: ComponentFixture<VerifyEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEmail],
      providers: [...testProviders, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyEmail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});