import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Categories } from './categories';
import { Category } from '@models/category.model';

describe('Categories', () => {
  let component: Categories;
  let fixture: ComponentFixture<Categories>;

  const mockCategories: Category[] = [
    { id: '1', name: 'Ordinateurs', slug: 'ordinateurs' },
    { id: '2', name: 'Périphériques', slug: 'peripheriques' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categories]
    }).compileComponents();

    fixture = TestBed.createComponent(Categories);
    component = fixture.componentInstance;
    component.categories = mockCategories;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle active category on select', () => {
    component.activeCategory = '';
    component.selectCategory.subscribe((id: string) => {
      expect(id).toBe('1');
    });
    component.onSelect('1');
  });

  it('should deselect if already active', () => {
    component.activeCategory = '1';
    component.selectCategory.subscribe((id: string) => {
      expect(id).toBe('');
    });
    component.onSelect('1');
  });
});