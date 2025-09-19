import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Movimento } from '../../entities/Movimento';
import { MovService } from '../../services/mov.service';

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

  ricaricaForm = this.fb.group({
    importo: ['', Validators.required],
    descrizioneEstesa: ['', Validators.required],
  })

  addMovRicarica(movimento: Partial<Movimento>) {
    const { importo, descrizioneEstesa } = this.ricaricaForm.value;
    movimento.saldo = Number(importo!);
    movimento.descrizioneEstesa = descrizioneEstesa!;
    movimento.categoriaMovimento = 1;
    this.movSrv.addMovRicaricaTelefonica(movimento);
  }
}
