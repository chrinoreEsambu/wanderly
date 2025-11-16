import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  isSidebarCollapsed = false;

  ngOnInit(): void {
    const saved = localStorage.getItem('sidebarCollapsed');
    this.isSidebarCollapsed = saved === 'true';
  }

  onSidebarCollapsedChange(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }
}
