import { Component, inject } from '@angular/core';
import { MovService } from '../../services/mov.service';
import { FormBuilder, Validators } from '@angular/forms';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bonifico',
  standalone: false,
  templateUrl: './bonifico.component.html',
  styleUrl: './bonifico.component.css'
})
export class BonificoComponent {
  protected fb = inject(FormBuilder);
  protected movSrv = inject(MovService);
  protected router = inject(Router);

  protected destroyed$ = new Subject<void>();

  bonificoForm = this.fb.group({
    importo: ['', [Validators.required]],
    iban: ['', Validators.required],
    descrizioneEstesa: ['', Validators.required]
  });

  bonificoError = '';

  ngOnInit() {
      this.bonificoForm.valueChanges
        .pipe(takeUntil(this.destroyed$))
        .subscribe(_ => {
          this.bonificoError = '';
        });
      }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  bonifico() {
    const { importo, iban, descrizioneEstesa } = this.bonificoForm.value;
    this.movSrv.addMovBonifico(Number(importo), descrizioneEstesa!, iban!).pipe(
            catchError(response => {
              this.bonificoError = response.error.message;
              return throwError(() => response);
            })
          )
          .subscribe(() => {
            this.router.navigate(['/']);
          });
  }
}
