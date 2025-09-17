import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, distinctUntilChanged, map, of, ReplaySubject, tap } from 'rxjs';
import { ContoCorrente } from '../entities/ControCorrente';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected http = inject(HttpClient);
  protected router = inject(Router);

  protected _currentUser$ = new ReplaySubject<ContoCorrente | null>(1);
  currentUser$ = this._currentUser$.asObservable();

  isAuthenticated$ = this.currentUser$
                      .pipe(
                        map(user => !!user),
                        distinctUntilChanged()
                      );

  constructor() {
    this.fetchUser().subscribe();
  }

  login(username: string, password: string) {
    return this.http.post<any>('/api/login', {username, password})
      .pipe(
        tap(res => this._currentUser$.next(res.user)),
        map(res => res.user)
      );
  }

  fetchUser() {
    return this.http.get<ContoCorrente>('/api/users/me')
      .pipe(
        catchError(_ => {
          return of(null);
        }),
        tap(user => this._currentUser$.next(user))
      );
  }

  logout() {
    this._currentUser$.next(null);
  }

  register(firstName: string, lastName: string, email: string, password: string) {
    return this.http.post<any>('/api/register', { firstName, lastName, email, password })
      .pipe(
        tap(res => this._currentUser$.next(res.user)),
        map(res => res.user)
      );
  }

}