import { Component, inject } from '@angular/core';
import { Movimento } from '../../entities/Movimento';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dettaglio-movimento',
  standalone: false,
  templateUrl: './dettaglio-movimento.component.html',
  styleUrl: './dettaglio-movimento.component.css'
})
export class DettaglioMovimentoComponent {
  protected activatedRoute = inject(ActivatedRoute);

  movimento$: Observable<Movimento> = this.activatedRoute.data
              .pipe(
                map(data => data['movimento'])
              );
}
