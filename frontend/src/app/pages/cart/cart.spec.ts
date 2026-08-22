import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartCanvas } from '../../shared/chart-canvas/chart-canvas';

describe('ChartCanvas', () => {
  let component: ChartCanvas;
  let fixture: ComponentFixture<ChartCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartCanvas],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartCanvas);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('type', 'line');
    fixture.componentRef.setInput('data', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});