import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ENVIRONMENT_INITIALIZER } from './app-init';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
  providers: [ENVIRONMENT_INITIALIZER],
  bootstrap: [AppComponent],
})
export class AppModule {}
