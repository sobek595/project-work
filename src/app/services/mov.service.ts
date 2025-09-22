import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { omitBy, isNil } from 'lodash';
import { AuthService } from './auth.service';

export type NumberFilter = {
  quantita?: number | null
}

export type DateFilter = {
  startDate?: string | null,
  endDate?: string | null
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
    filters.quantita = 5;
    const q: any = omitBy(filters, isNil);
    return this.http.get<any>('/api/mov/MovLastNList', { params: q});
  }

  addMovRicaricaTelefonica(importo: number, descrizioneEstesa: string, categoriaMovimento: string) {
    categoriaMovimento = "1";
    const q: any = { importo, descrizioneEstesa, categoriaMovimento };
    return this.http.post<any>('/api/mov/AddMov', q);
  }

  addMovBonifico(importo: number, descrizioneEstesa: string, ibanDestinatario: string){
    const categoriaMovimento = "3";
    const q: any = { importo, descrizioneEstesa, ibanDestinatario, categoriaMovimento };
    return this.http.post<any>('/api/mov/AddMov', q);
  }

  listDateFiltered(startDate: string | null, endDate: string | null){
    const q: any = omitBy({startDate, endDate}, isNil);
    return this.http.get<any>('/api/mov/MovBtwDatesList', { params: q});
  }

}
