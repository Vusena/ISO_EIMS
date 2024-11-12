import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class HasRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // getting from the route
    const requiredRole: string[] = route.data.requiredRole;
    const userRoles = this.authService.getUserRoles();
    const hasRequiredRole = requiredRole.some(role => userRoles.includes(role));
    if (hasRequiredRole) {
        return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}