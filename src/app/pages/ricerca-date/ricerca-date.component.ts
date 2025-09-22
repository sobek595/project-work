import { Component, inject } from '@angular/core';
import { omitBy } from 'lodash';
import { Subject, Observable, map, switchMap, catchError, of, takeUntil, debounceTime } from 'rxjs';
import { MovService, NumberFilter } from '../../services/mov.service';
import { MovimentiResponse } from '../homepage/homepage.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgbDateStruct, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ricerca-date',
  standalone: false,
  templateUrl: './ricerca-date.component.html',
  styleUrl: './ricerca-date.component.css'
})
export class RicercaDateComponent {
  protected authSrv = inject(AuthService);
  protected movSrv = inject(MovService);
  protected activatedRoute = inject(ActivatedRoute);
  protected router = inject(Router);
  protected calendar = inject(NgbCalendar);
  protected modalService = inject(NgbModal);

  quantita = 5;
  dataInizio: NgbDateStruct | null = null;
  dataFine: NgbDateStruct | null = null;

  protected updateQueryParams$ = new Subject<NumberFilter & { startDate?: string | null, endDate?: string | null }>();

  filters$: Observable<NumberFilter & { startDate?: string | null, endDate?: string | null }> = this.activatedRoute.queryParams.pipe(
    map(params => ({
      quantita: params['quantita'] ? Number(params['quantita']) : 5,
      startDate: params['startDate'] || null,
      endDate: params['endDate'] || null
    }))
  );

  movList$: Observable<MovimentiResponse> = this.filters$.pipe(
    switchMap(filters => {
      // Se sono presenti le date, usa il filtro per data
      if (filters.startDate || filters.endDate) {
        return this.movSrv.listDateFiltered(filters.startDate || null, filters.endDate || null).pipe(
          catchError(err => {
            console.error(err);
            return of<MovimentiResponse>({
              saldoFinale: 0,
              movimenti: []
            });
          })
        );
      } else {
        // Altrimenti usa il filtro per quantità
        return this.movSrv.listNumFiltered({ quantita: filters.quantita }).pipe(
          catchError(err => {
            console.error(err);
            return of<MovimentiResponse>({
              saldoFinale: 0,
              movimenti: []
            });
          })
        );
      }
    })
  );

  protected destroyed$ = new Subject<void>();

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.quantita = params['quantita'] ? Number(params['quantita']) : 5;
        this.dataInizio = params['startDate'] ? this.parseDate(params['startDate']) : null;
        this.dataFine = params['endDate'] ? this.parseDate(params['endDate']) : null;
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

  onQuantitaChange(value: number) {
    this.updateQueryParams$.next({
      quantita: value,
      startDate: this.dataInizio ? this.formatDate(this.dataInizio) : null,
      endDate: this.dataFine ? this.formatDate(this.dataFine) : null
    });
  }

  openDateModal(content: any, type: 'inizio' | 'fine') {
    this.modalService.open(content).result.then((result: NgbDateStruct) => {
      if (type === 'inizio') {
        this.dataInizio = result;
      } else {
        this.dataFine = result;
      }
      this.updateQueryParams$.next({
        quantita: this.quantita,
        startDate: this.dataInizio ? this.formatDate(this.dataInizio) : null,
        endDate: this.dataFine ? this.formatDate(this.dataFine) : null
      });
    }, () => {});
  }

  formatDate(date: NgbDateStruct): string {
    return `${date.year}-${('0'+date.month).slice(-2)}-${('0'+date.day).slice(-2)}`;
  }

  parseDate(dateStr: string): NgbDateStruct {
    const [year, month, day] = dateStr.split('-').map(Number);
    return { year, month, day };
  }
}
