import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarProducts } from './similar-products';

describe('SimilarProducts', () => {
  let component: SimilarProducts;
  let fixture: ComponentFixture<SimilarProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilarProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimilarProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
