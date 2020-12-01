import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

    isAuthenticated = false;

    constructor(private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        const credentials = localStorage.getItem('credential');

        if (typeof credentials !== 'undefined' && credentials !== null) {

            if (next.data.permission && !this.isAllowed(next.data.permission)) {
                return false;
            }

            return true;
        }

        this.router.navigate(['/login']);

        return false;
    }

    isAllowed(permissionName): boolean {
        return JSON.parse(localStorage.getItem('user')).permissions.find(obj => obj === permissionName);
    }
}
