import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MovService, NumberFilter } from '../../services/mov.service';
import { catchError, debounceTime, map, Observable, Subject, switchMap, takeUntil, tap, filter, merge, of } from 'rxjs';
import { omitBy } from 'lodash';
import { Movimento } from '../../entities/Movimento';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  protected authSrv = inject(AuthService);
  protected movSrv = inject(MovService);
  protected activatedRoute = inject(ActivatedRoute);
  protected router = inject(Router);

  currentUser$ = this.authSrv.currentUser$                                   

  protected updateQueryParams$ = new Subject<NumberFilter>();

  filters$: Observable<NumberFilter> = this.activatedRoute.queryParams.pipe(
    map(params => ({ quantita: params['quantita'] ? Number(params['quantita']) : 5 } as NumberFilter))
  );

  movList$: Observable<MovimentiResponse> = this.filters$.pipe(
    switchMap(filters =>
      this.movSrv.listNumFiltered(filters).pipe(
        catchError(err => {
          console.error(err);
          return of<MovimentiResponse>({
            saldo: 0,
            movimenti: []
          });
        })
      )
    )
  );

  protected destroyed$ = new Subject<void>();

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.quantita = params['quantita'] ? Number(params['quantita']) : 5;
      });

    this.updateQueryParams$
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(300),
        map(filters => omitBy(filters, val => val === null))
      )
      .subscribe(filters => {
        this.router.navigate([], {
          queryParams: filters,
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  quantita = 5;

  onQuantitaChange(value: number | string) {
    this.quantita = Number(value);
    this.updateQueryParams$.next({ quantita: this.quantita });
  }



private fb = inject(FormBuilder);

  exportForm = this.fb.group({
    formato: ['csv']
  });

  onExport() {
    const n  = this.quantita
    const { formato } = this.exportForm.value;

    this.movSrv.exportMovimentiN(n!, formato!).subscribe(blob => {
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



// Sposta l'interfaccia fuori dalla classe!
export interface MovimentiResponse {
  saldo: number;
  movimenti: Movimento[];
}