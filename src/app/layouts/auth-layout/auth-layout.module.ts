import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { TermsComponent } from 'src/app/pages/terms/terms.component'
import { PrivacyComponent } from 'src/app/pages/privacy/privacy.component'
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    // NgbModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    TermsComponent,
    PrivacyComponent
  ]
})
export class AuthLayoutModule { }
