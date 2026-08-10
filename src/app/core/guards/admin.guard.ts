// core/guards/admin.guard.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  return toObservable(auth.sessionChecked).pipe(
    filter((checked) => checked === true),
    take(1),
    map(() => {
    
      if (isPlatformServer(platformId)) {
        return true;
      }

      if (!auth.isLoggedIn()) {
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        return false;
      }

      if (auth.isAdmin()) {
        return true;
      }

      router.navigate(['/']);
      return false;
    })
  );
};