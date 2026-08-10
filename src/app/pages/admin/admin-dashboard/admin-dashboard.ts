import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Package, ClipboardList } from 'lucide-angular';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  readonly Package = Package;
  readonly ClipboardList = ClipboardList;
}