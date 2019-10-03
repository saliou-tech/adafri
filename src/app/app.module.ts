import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule  } from '@angular/fire';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {  BrowserModule, BrowserTransferStateModule  } from '@angular/platform-browser';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgModule } from '@angular/core';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {MatDialogModule} from '@angular/material/dialog';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as firebase from 'firebase';

import * as FusionCharts from 'fusioncharts';

import { ColorPickerModule } from 'ngx-color-picker';

import { NgxFormatFieldModule } from 'ngx-format-field';

import { AccordionModule } from 'primeng/accordion';

import { DeviceDetectorModule } from 'ngx-device-detector';

import { FusionChartsModule } from 'angular-fusioncharts';

import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as TimeSeries from 'fusioncharts/fusioncharts.timeseries';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';

import { AuthGuard } from './app_core/core/auth.guard';
import { CoreModule } from './app_core/core/core.module';
import { NotesModule } from './app_core/notes/notes.module';
import { UiModule } from './app_core/ui/ui.module';
 import { NgNetworkStatusModule } from 'ng-network-status'; // <-- HERE

import {FIREBASE_CREDENTIALS} from '../environments/environment';



FusionChartsModule.fcRoot(FusionCharts, Charts, TimeSeries);

/* const credentials = {
     apiKey: "AIzaSyC_cYQskL_dKhkt-aQ1ayHt8ia2NQYEHTs",
    authDomain: "comparez.firebaseapp.com",
    databaseURL: "https://comparez.firebaseio.com",
    projectId: "comparez",
    storageBucket: "gs://comparez.appspot.com/",
    messagingSenderId: "975260713071",
  }
   */


firebase.initializeApp(FIREBASE_CREDENTIALS)



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    DeviceDetectorModule.forRoot(),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    CoreModule,
    UiModule,
    NotesModule,
    AngularFireModule.initializeApp(FIREBASE_CREDENTIALS, 'firestarter'),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ColorPickerModule,
    NgbModule.forRoot(),
    NgxFormatFieldModule,
    FusionChartsModule,
    AccordionModule,
    NgNetworkStatusModule,
    MatDialogModule

    
    
  
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
