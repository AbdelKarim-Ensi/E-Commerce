import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  @Output() shopNow = new EventEmitter<void>();
  @Output() viewDeals = new EventEmitter<void>();

  protected readonly stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '2K+',  label: 'Products' },
    { value: '4.9★', label: 'Avg Rating' },
  ];
}