import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { authGuard } from './utils/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { RicaricaComponent } from './pages/ricarica/ricarica.component';
import { BonificoComponent } from './pages/bonifico/bonifico.component';
import { RicercaDateComponent } from './pages/ricerca-date/ricerca-date.component';
import { RicercaCategoriaComponent } from './pages/ricerca-categoria/ricerca-categoria.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { DettaglioMovimentoComponent } from './pages/dettaglio-movimento/dettaglio-movimento.component';
import { movDetailResolver } from './resolvers/mov-detail.resolver';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'homepage',
    component: HomepageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ricarica',
    component: RicaricaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'bonifico',
    component: BonificoComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ricerca-date',
    component: RicercaDateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ricerca-categoria',
    component: RicercaCategoriaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'change-password',
    component: ResetPasswordComponent,
    canActivate: [authGuard]
  },
  {
    path:'movimento/:id',
    component: DettaglioMovimentoComponent,
    resolve: {movimento: movDetailResolver}
  },
  {
    path: '',
    redirectTo: '/homepage',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
