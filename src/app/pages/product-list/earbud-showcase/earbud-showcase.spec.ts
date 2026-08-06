import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EarbudShowcase } from './earbud-showcase';

describe('EarbudShowcase', () => {
  let component: EarbudShowcase;
  let fixture: ComponentFixture<EarbudShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarbudShowcase],
    }).compileComponents();

    fixture = TestBed.createComponent(EarbudShowcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});