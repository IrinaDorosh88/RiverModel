import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ENVIRONMENT_INITIALIZER } from './app-init';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [ENVIRONMENT_INITIALIZER],
  bootstrap: [AppComponent],
})
export class AppModule {}
