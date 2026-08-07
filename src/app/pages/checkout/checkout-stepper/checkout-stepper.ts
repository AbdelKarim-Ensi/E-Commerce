import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CheckoutStep } from '../../../core/models/checkout.model';

interface Step {
  number: CheckoutStep;
  label: string;
}

@Component({
  selector: 'app-checkout-stepper',
  standalone: true,
  templateUrl: './checkout-stepper.html',
  styleUrl: './checkout-stepper.css',
})
export class CheckoutStepper {
  @Input() currentStep: CheckoutStep = 1;
  @Output() goToStep = new EventEmitter<CheckoutStep>();

  protected readonly steps: Step[] = [
    { number: 1, label: 'Shipping' },
    { number: 2, label: 'Payment' },
    { number: 3, label: 'Review' },
  ];

  protected isCompleted(step: CheckoutStep) { return this.currentStep > step; }
  protected isActive(step: CheckoutStep) { return this.currentStep === step; }
  protected canGoTo(step: CheckoutStep) { return this.currentStep >= step; }
}