import { Routes } from '@angular/router';
import { PrivacyComponent } from 'src/app/pages/privacy/privacy.component'
import { TermsComponent } from 'src/app/pages/terms/terms.component'

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'privacy-policy', component: PrivacyComponent },
    { path: 'terms-condition', component: TermsComponent },
];
