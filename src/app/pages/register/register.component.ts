import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

  registerForm = this.fb.group(
  {
    nomeTitolare: ['', Validators.required],
    cognomeTitolare: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  },
  {
    validators: this.matchPasswordsValidator('password', 'confirmPassword')
  }
);

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
    const { nomeTitolare, cognomeTitolare, email, password } = this.registerForm.value;

    this.authSrv.register(nomeTitolare!, cognomeTitolare!, email!, password!)
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

   logout() {
    this.authSrv.logout();
  }

  matchPasswordsValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get(passwordField)?.value;
    const confirmPassword = formGroup.get(confirmPasswordField)?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      formGroup.get(confirmPasswordField)?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // se non ci sono errori, rimuovo passwordMismatch
      if (formGroup.get(confirmPasswordField)?.hasError('passwordMismatch')) {
        formGroup.get(confirmPasswordField)?.setErrors(null);
      }
      return null;
    }
  };
}
}
