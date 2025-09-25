import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { omitBy, isNil } from 'lodash';
import { CategoriaMovimento, Movimento } from '../entities/Movimento';
import { AuthService } from './auth.service';

export type NumberFilter = {
  quantita?: number | null
}

export type DateFilter = {
  startDate?: string | null,
  endDate?: string | null
}

export type CatFilter = {
  n?: number | null
  categoria?: string | null
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
    return this.http.get<any>('https://backend-ax2m.onrender.com/api/mov/MovLastNList', { params: q});
  }

  addMovRicaricaTelefonica(importo: number, descrizioneEstesa: string, categoriaMovimento: string) {
    categoriaMovimento = "1";
    const q: any = { importo, descrizioneEstesa, categoriaMovimento };
    return this.http.post<any>('https://backend-ax2m.onrender.com/api/mov/AddMov', q);
  }

  addMovBonifico(importo: number, descrizioneEstesa: string, ibanDestinatario: string){
    const categoriaMovimento = "3";
    const q: any = { importo, descrizioneEstesa, ibanDestinatario, categoriaMovimento };
    return this.http.post<any>('https://backend-ax2m.onrender.com/api/mov/AddMov', q);
  }

  listDateFiltered(startDate: string | null, endDate: string | null, n: number | null) {
    const q: any = omitBy({startDate, endDate,n}, isNil);
    return this.http.get<any>('https://backend-ax2m.onrender.com/api/mov/MovBtwDatesList', { params: q});
  }

  listCatFiltered(n: number | null, categoria: string | null){
    console.log(n, categoria);
    const q: any = omitBy({n, categoria}, isNil);
    return this.http.get<any>('https://backend-ax2m.onrender.com/api/mov/MovCatList', { params: q});
  }

  listCat() {
    return this.http.get<CategoriaMovimento[]>('https://backend-ax2m.onrender.com/api/cat/list');
  }

  exportMovimentiN(n: number, formato: string) {
    return this.http.get(`https://backend-ax2m.onrender.com/api/mov/exp1`, {
      params: { n, formato },
      responseType: 'blob' // fondamentale per file
    });
  }

  exportMovimentiCat(n: number, categoria: string ,formato: string) {
    return this.http.get(`https://backend-ax2m.onrender.com/api/mov/exp2`, {
      params: { n, categoria,formato  },
      responseType: 'blob' // fondamentale per file
    });
  }

  exportMovimentiDate(n: number, dataInizio: string , dataFine: string  ,formato: string) {
    return this.http.get(`https://backend-ax2m.onrender.com/api/mov/exp3`, {
      params: { n, dataInizio, dataFine ,formato  },
      responseType: 'blob' // fondamentale per file
    });
  }

  getById(id: string) {
    return this.http.get<Movimento>(`https://backend-ax2m.onrender.com/api/mov/${id}`);
  }
}
