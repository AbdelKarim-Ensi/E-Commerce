import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FlashDeals } from './flash-deals';

describe('FlashDeals', () => {
  let component: FlashDeals;
  let fixture: ComponentFixture<FlashDeals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashDeals]
    }).compileComponents();

    fixture = TestBed.createComponent(FlashDeals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should countdown seconds', fakeAsync(() => {
    const initial = component.time.s;
    tick(1100);
    expect(component.time.s).toBeLessThanOrEqual(initial);
  }));

  afterEach(() => {
    component.ngOnDestroy();
  });
});