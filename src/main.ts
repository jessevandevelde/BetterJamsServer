import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { importProvidersFrom } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideStore(),
    importProvidersFrom([
      StoreDevtoolsModule.instrument({
        name: 'BetterJams',
        maxAge: 25,
        logOnly: false,
        serialize: true,
        connectInZone: true,
      }),
    ]),
  ],
})
  // eslint-disable-next-line no-console
  .catch((err: unknown) => { console.error(err); });
