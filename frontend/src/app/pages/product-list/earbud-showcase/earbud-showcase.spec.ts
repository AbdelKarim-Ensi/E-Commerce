import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { EarbudShowcase } from './earbud-showcase';
import { testProviders } from '../../../../test/test-providers';

describe('EarbudShowcase', () => {
  let component: EarbudShowcase;
  let fixture: ComponentFixture<EarbudShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarbudShowcase],
      providers: [
        ...testProviders,
        provideNoopAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map(), queryParamMap: new Map() },
            paramMap: of(new Map()),
            queryParamMap: of(new Map()),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EarbudShowcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});