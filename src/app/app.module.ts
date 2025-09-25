import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authInterceptor } from './services/auth.interceptor';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MenuComponent } from './components/menu/menu.component';
import { RicaricaComponent } from './pages/ricarica/ricarica.component';
import { BonificoComponent } from './pages/bonifico/bonifico.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RicercaDateComponent } from './pages/ricerca-date/ricerca-date.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RicercaCategoriaComponent } from './pages/ricerca-categoria/ricerca-categoria.component';
import { MovimentoComponent } from './components/movimento/movimento.component';
import { DettaglioMovimentoComponent } from './pages/dettaglio-movimento/dettaglio-movimento.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    HomepageComponent,
    MenuComponent,
    RicaricaComponent,
    BonificoComponent,
    ResetPasswordComponent,
    RicercaCategoriaComponent,
    RicercaDateComponent,
    MovimentoComponent,
    DettaglioMovimentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgbDatepickerModule
],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }