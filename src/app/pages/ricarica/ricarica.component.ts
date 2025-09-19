import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Movimento } from '../../entities/Movimento';
import { MovService } from '../../services/mov.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-ricarica',
  standalone: false,
  templateUrl: './ricarica.component.html',
  styleUrl: './ricarica.component.css'
})
export class RicaricaComponent {
  protected fb = inject(FormBuilder);
  protected movSrv = inject(MovService);
  protected route = inject(Router);

  movError = '';

  ricaricaForm = this.fb.group({
    numeroTelefono: [''],
    importo: ['', Validators.required],
    descrizioneEstesa: ['', Validators.required],
  })

addMovRicarica() {
  const { importo, descrizioneEstesa, numeroTelefono } = this.ricaricaForm.value;
  const categoriaMovimento = "1";

  this.movSrv.addMovRicaricaTelefonica(Number(importo)!, '(' + numeroTelefono + ') '  + descrizioneEstesa!, categoriaMovimento)
    .pipe(
      catchError(response => {
        this.movError = response.error.message;
        return throwError(() => response);
      })
    )
    .subscribe(() => {
      this.route.navigate(['/homepage']);
    });
}
}
