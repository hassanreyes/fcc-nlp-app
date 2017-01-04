import { BrowserModule }      from '@angular/platform-browser';
import { NgModule }           from '@angular/core';
import { FormsModule }        from '@angular/forms';
import { HttpModule, Http, RequestOptions }         from '@angular/http';
import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';

import { BarService }         from './bar/bar.service';

import { AppComponent }       from './app.component';
import { BarListComponent }   from './bar/bar-list/bar-list.component';
import { Auth }               from './auth.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type':'application/json'}]
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    BarListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [BarService,
              {
                provide: AuthHttp,
                useFactory: authHttpServiceFactory,
                deps: [Http, RequestOptions]
              },
              Auth],
  bootstrap: [AppComponent]
})
export class AppModule { }
