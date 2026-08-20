import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrustSection } from './trust-section';

describe('TrustSection', () => {
  let component: TrustSection;
  let fixture: ComponentFixture<TrustSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TrustSection] }).compileComponents();
    fixture = TestBed.createComponent(TrustSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});