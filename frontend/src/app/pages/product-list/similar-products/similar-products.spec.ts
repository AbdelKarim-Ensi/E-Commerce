import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SimilarProducts } from './similar-products';
import { testProviders } from '../../../../test/test-providers';

describe('SimilarProducts', () => {
  let component: SimilarProducts;
  let fixture: ComponentFixture<SimilarProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilarProducts],
      providers: [...testProviders, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SimilarProducts);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentProduct', {
      id: '1',
      categoryId: 'cat-1',
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});