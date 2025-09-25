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

  categorie$ = this.movSrv.listCat();

  filters$: Observable<CatFilter> = this.activatedRoute.queryParams.pipe(
  map(params => ({
    n: params['n'] ? Number(params['n']) : null,
    categoria: params['categoria'] ?? null
  }))
);

movList$ = this.filters$.pipe(
  switchMap(filters => {
    const n = filters.n ?? null;
    const categoria = filters.categoria ?? null;
    return this.movSrv.listCatFiltered(n, categoria).pipe(
      catchError(err => {
        console.error(err);
        return of([]); // importante restituire un observable vuoto
      })
    );
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
    n: new FormControl<number | null>(5),
    categoria: new FormControl<string | null>(''),
    formato: ['csv']
    
  });

  onExport() {
    const { n, categoria , formato } = this.filtersForm.value;

    this.movSrv.exportMovimentiCat(n!, categoria!, formato!).subscribe(blob => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `movimenti.${formato}`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  goToDetails(id: string) {
    this.router.navigate(['/movimento', id]);
  }
}
