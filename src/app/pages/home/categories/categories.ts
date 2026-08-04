import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '@models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  @Input() categories: Category[] = [];
  @Input() activeCategory = '';
  @Output() selectCategory = new EventEmitter<string>();
}