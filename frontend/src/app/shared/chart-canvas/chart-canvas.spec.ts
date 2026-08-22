import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartCanvas } from './chart-canvas';

describe('ChartCanvas', () => {
  let component: ChartCanvas;
  let fixture: ComponentFixture<ChartCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartCanvas]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartCanvas);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('type', 'bar');
    fixture.componentRef.setInput('data', {
      labels: ['A', 'B'],
      datasets: [{ label: 'Test', data: [1, 2] }],
    });

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});