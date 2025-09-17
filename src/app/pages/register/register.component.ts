import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';
import { Router } from '@angular/router';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected jwtSrv = inject(JwtService);
  protected router = inject(Router);

  protected destroyed$ = new Subject<void>();

  registerForm = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  registerError = '';

  ngOnInit() {
    this.registerForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(_ => {
        this.registerError = '';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  register() {
    const { name, surname, username, password } = this.registerForm.value;

    this.authSrv.register(name!, surname!, username!, password!)
      .pipe(
        catchError(response => {
          this.registerError = response.error.message;
          return throwError(() => response);
        })
      )
      .subscribe(() => {
        this.router.navigate(['/login']); 
      });
   }
}
