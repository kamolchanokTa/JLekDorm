import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouteModule } from './app.router';

import { AppComponent } from './app.component';
import { componentList, bootstrap } from './components.register';
@NgModule({
  declarations: [
    componentList
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouteModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  //providers: [serviceList],
  bootstrap: [AppComponent]
})
export class AppModule { }
