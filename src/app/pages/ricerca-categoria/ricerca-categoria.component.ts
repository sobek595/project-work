import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable, map, switchMap, catchError, of, debounceTime, takeUntil, tap, filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CatFilter, MovService} from '../../services/mov.service';
import { MovimentiResponse } from '../homepage/homepage.component';
import { omitBy } from 'lodash';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-ricerca-categoria',
  standalone: false,
  templateUrl: './ricerca-categoria.component.html',
  styleUrl: './ricerca-categoria.component.css'
})
export class RicercaCategoriaComponent {
  protected authSrv = inject(AuthService);
  protected movSrv = inject(MovService);
  protected activatedRoute = inject(ActivatedRoute);
  protected router = inject(Router);

  currentUser$ = this.authSrv.currentUser$                                   

  protected updateQueryParams$ = new Subject<CatFilter>();

  filters$: Observable<CatFilter> = this.activatedRoute.data
                                          .pipe(
                                            map(data => data['filters'])
                                          );

  categorie$ = this.movSrv.listCat();

  movList$= this.filters$
                .pipe(
                  switchMap(filters => {
                    return this.movSrv.listCatFiltered(filters)
                      .pipe(
                        catchError(err => {
                          console.error(err);
                          return [];
                        })
                      )
                  })
                );


  protected destroyed$ = new Subject<void>();
  
    ngOnInit() {

      this.updateQueryParams$
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(300),
        map(filters => omitBy(filters, val => val === ''))
      )
      .subscribe(filters => {
        this.router.navigate([], {queryParams: filters});
      });


       this.filtersForm.valueChanges
      .pipe(
        filter(_ => this.filtersForm.valid),
        takeUntil(this.destroyed$)
      )
      .subscribe(filterValue => {
        this.setFilters(filterValue);
      });
    }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  setFilters(filters: CatFilter) {
    this.updateQueryParams$.next(filters);
  }

   protected fb = inject(FormBuilder);

  filtersForm = this.fb.group({
    quantita: new FormControl<number | null>(5),
    categoria: new FormControl<string | null>(''),
    
  });
}
