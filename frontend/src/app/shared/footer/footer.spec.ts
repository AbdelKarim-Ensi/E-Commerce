import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Footer } from './footer';
import { NewsletterService } from '@services/newsletter.service';
import { CategoriesService } from '@services/categories.service';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;
  let newsletterServiceMock: { subscribe: ReturnType<typeof vi.fn> };
  let categoriesServiceMock: { getCategories: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    newsletterServiceMock = { subscribe: vi.fn() };
    categoriesServiceMock = { getCategories: vi.fn().mockReturnValue(of([])) };

    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [
        { provide: NewsletterService, useValue: newsletterServiceMock },
        { provide: CategoriesService, useValue: categoriesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(categoriesServiceMock.getCategories).toHaveBeenCalled();
    expect((component as any).categories()).toEqual([]);
  });

  it('should subscribe with a valid email', () => {
    newsletterServiceMock.subscribe.mockReturnValue(of(undefined));

    (component as any).email.set('test@example.com');
    (component as any).subscribe(new Event('submit'));

    expect(newsletterServiceMock.subscribe).toHaveBeenCalledWith('test@example.com');
    expect((component as any).subscribed()).toBe(true);
    expect((component as any).email()).toBe('');
  });

  it('should not subscribe with an empty email', () => {
    (component as any).email.set('   ');
    (component as any).subscribe(new Event('submit'));

    expect(newsletterServiceMock.subscribe).not.toHaveBeenCalled();
  });

  it('should set an error message when subscription fails', () => {
    newsletterServiceMock.subscribe.mockReturnValue(
      throwError(() => ({ error: { message: 'Email déjà inscrit' } })),
    );

    (component as any).email.set('test@example.com');
    (component as any).subscribe(new Event('submit'));

    expect((component as any).errorMessage()).toBe('Email déjà inscrit');
    expect((component as any).subscribed()).toBe(false);
  });
});