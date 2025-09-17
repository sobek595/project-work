import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, ReplaySubject, tap } from 'rxjs';
import { ContoCorrente } from '../entities/ControCorrente';

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
                        distinctUntilChanged(),
                        tap(isLoggedIn => console.log(isLoggedIn))
                      );

  constructor() {
    this.fetchUser().subscribe();
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

   login(email: string, password: string) {
    return this.http.post<any>('/api/login', {email, password})
      .pipe(
        tap(res => this._currentUser$.next(res.user)),
        map(res => res.user)
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
