import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Profile } from './profile';
import { testProviders } from '../../../test/test-providers';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [...testProviders, provideRouter([{ path: 'login', component: Profile }])],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});