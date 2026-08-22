import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlashDeals } from './flash-deals';
import { API_BASE_URL } from '../../../core/api-base-url.token';

describe('FlashDeals', () => {
  let component: FlashDeals;
  let fixture: ComponentFixture<FlashDeals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashDeals],
      providers: [{ provide: API_BASE_URL, useValue: 'http://localhost:3000/api' }],
    }).compileComponents();

    fixture = TestBed.createComponent(FlashDeals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component?.ngOnDestroy();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should countdown seconds', () => {
    vi.useFakeTimers();
    const initial = component.time.s;
    vi.advanceTimersByTime(1100);
    fixture.detectChanges();
    expect(component.time.s).toBeLessThanOrEqual(initial);
  });
});