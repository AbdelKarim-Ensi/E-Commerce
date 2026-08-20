import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarRating } from './star-rating';

describe('StarRating', () => {
  let component: StarRating;
  let fixture: ComponentFixture<StarRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StarRating] }).compileComponents();
    fixture = TestBed.createComponent(StarRating);
    component = fixture.componentInstance;
    component.rating = 4.5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute fill percent per star', () => {
    expect(component.fillPercent(1)).toBe(100);
    expect(component.fillPercent(5)).toBe(50);
  });
});