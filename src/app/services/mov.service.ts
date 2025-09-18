import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { omitBy, isNil } from 'lodash';

export type NumberFilter = {
  num?: number | null
}


@Injectable({
  providedIn: 'root'
})
export class MovService {

  constructor() { }

  protected http = inject(HttpClient);

  listNumFiltered(filters: NumberFilter = {}) {
    const q: any = omitBy(filters, isNil);
    return this.http.get<any>('/api/mov/MovLast5List', { params: q});
  }
}
