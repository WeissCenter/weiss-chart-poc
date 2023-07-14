import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { defineCustomElements, applyPolyfills } from '@visa/charts/dist/loader';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));




  applyPolyfills().then(() => defineCustomElements(window));