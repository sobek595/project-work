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
  beneficiario: ['', Validators.required],
  iban: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/i) // IBAN generale
    ]
  ],
  importo: ['', [Validators.required, Validators.min(0.01)]],
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
    const { importo, iban, descrizioneEstesa, beneficiario } = this.bonificoForm.value;
    this.movSrv.addMovBonifico(Number(importo), 'IBAN Beneficiario: '+iban! + ' - Beneficiario: '+ beneficiario! + ' - ' +descrizioneEstesa! , iban!).pipe(
            catchError(response => {
              this.bonificoError = response.error.error;
              return throwError(() => response);
            })
          )
          .subscribe(() => {
            this.router.navigate(['/']);
          });
  }
}
