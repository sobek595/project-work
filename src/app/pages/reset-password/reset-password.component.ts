import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);
  protected destroyed$ = new Subject<void>();

  resetPasswordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required]
  });

  passwordError = '';


  ngOnInit() {
      this.resetPasswordForm.valueChanges
        .pipe(takeUntil(this.destroyed$))
        .subscribe(_ => {
          this.passwordError = '';
        });
    }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  resetPassword() {
  const { oldPassword, newPassword } = this.resetPasswordForm.value;

  this.authSrv.changePassword(oldPassword!, newPassword!)
    .pipe(
      catchError(response => {
        this.passwordError = response.error.message; // Mostra l'errore qui
        return throwError(() => response);
      })
    )
    .subscribe(() => {
      this.authSrv.logout();
      this.router.navigate(['/']);
    });
}

}
