import { Environment } from './../../config/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: 'fas fa-tachometer-alt', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  user: any = JSON.parse(localStorage.getItem('user'));

  public menuItems: any[];
  public isCollapsed = true;

  constructor(
    private router: Router,
    public env: Environment,
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  onLogOut() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}
