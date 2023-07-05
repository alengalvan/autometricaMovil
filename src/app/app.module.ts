import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UtilitiesService } from './services/utilities.service';
import { HttpClientModule } from '@angular/common/http';
import { WebRestService } from './services/crud-rest.service';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { sqliteService } from './services/sqlite.service';
// import { TrimDirective } from './trim.directive';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NgxTrimDirectiveModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, UtilitiesService, WebRestService, DocumentViewer, sqliteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
