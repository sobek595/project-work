import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MovService, NumberFilter } from '../../services/mov.service';
import { catchError, debounceTime, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { omitBy } from 'lodash';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  protected authSrv = inject(AuthService);
  protected movSrv = inject(MovService);
  protected activatedRoute = inject(ActivatedRoute);
  protected router = inject(Router);

  currentUser$ = this.authSrv.currentUser$

  filters$: Observable<NumberFilter> = this.activatedRoute.data
                                          .pipe(
                                            map(data => data['filters'])
                                          );
  movList$ = this.filters$
                .pipe(
                  switchMap(filters => {
                    return this.movSrv.listNumFiltered(filters)
                      .pipe(
                        catchError(err => {
                          console.error(err);
                          return [];
                        })
                      )
                  })
                );

  protected updateQueryParams$ = new Subject<NumberFilter>();
  
  protected destroyed$ = new Subject<void>();

  ngOnInit() {
    
    this.updateQueryParams$
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(300),
        map(filters => omitBy(filters, val => val === null))
      )
      .subscribe(filters => {
        this.router.navigate([], {queryParams: filters});
      });
  }
     
 ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
