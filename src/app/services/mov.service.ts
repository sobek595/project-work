import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { omitBy, isNil } from 'lodash';
import { Movimento } from '../entities/Movimento';
import { AuthService } from './auth.service';

export type NumberFilter = {
  num?: number | null
}


@Injectable({
  providedIn: 'root'
})
export class MovService {
  protected http = inject(HttpClient);
  protected authSrv = inject(AuthService);

  constructor() { 

  }


  listNumFiltered(filters: NumberFilter = {}) {
    const q: any = omitBy(filters, isNil);
    return this.http.get<any>('/api/mov/MovLast5List', { params: q});
  }

  addMovRicaricaTelefonica(movimento: Partial<Movimento>) {
    movimento.categoriaMovimento = 1;
    return this.http.post<any>('/api/mov/AddMov', movimento);
  }
}
