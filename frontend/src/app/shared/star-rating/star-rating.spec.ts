import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarRating } from './star-rating';

describe('StarRating', () => {
  let component: StarRating;
  let fixture: ComponentFixture<StarRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarRating],
    }).compileComponents();

    fixture = TestBed.createComponent(StarRating);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return all stars fully filled when rating is 5', () => {
    component.rating = 5;
    expect(component.stars).toEqual([100, 100, 100, 100, 100]);
  });

  it('should return no stars filled when rating is 0', () => {
    component.rating = 0;
    expect(component.stars).toEqual([0, 0, 0, 0, 0]);
  });

  it('should partially fill the star matching a fractional rating', () => {
    component.rating = 3.5;
    expect(component.stars).toEqual([100, 100, 100, 50, 0]);
  });

  it('should clamp fill percent between 0 and 100 for a rating like 1', () => {
    component.rating = 1;
    expect(component.stars).toEqual([100, 0, 0, 0, 0]);
  });
});