import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ContoCorrente } from '../../entities/ControCorrente';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
    protected router = inject(Router);
    protected authSrv = inject(AuthService);
    protected destroyed$ = new Subject<void>();

    profileError = '';

    currentUser$ = this.authSrv.currentUser$
}
