import type { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { provideState } from '@ngrx/store';
import { reducer } from './components/search-bar/store/search-bar.reducer';
import { provideEffects } from '@ngrx/effects';
import { SearchBarEffects } from './components/search-bar/store';

export const routes: Routes = [
  {
    path: '',
    providers: [
      provideState('search', reducer),
      provideEffects(SearchBarEffects),
    ],
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
    ],
  },
];
