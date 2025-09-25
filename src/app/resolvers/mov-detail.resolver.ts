import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Movimento } from '../entities/Movimento';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { MovService } from '../services/mov.service';

export const movDetailResolver: ResolveFn<Movimento> = (route, state) => {
   const movSrv = inject(MovService);
  const router = inject(Router);

  const id = route.paramMap.get('id');
  console.log(id);
  if (!id) {
    return new RedirectCommand(router.parseUrl('/homepage'));
  }

  return movSrv.getById(id)
    .pipe(
      catchError(_ => {
        return of(new RedirectCommand(router.parseUrl('/homepage')));
      })
    );
};
