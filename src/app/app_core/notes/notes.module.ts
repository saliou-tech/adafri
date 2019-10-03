import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatTableModule, MatInputModule, MatIconModule, MatChipsModule, MatCardModule, MatExpansionModule, MatListModule, MatMenuModule, MatPaginatorModule, MatPaginatorIntl, MatToolbarModule, MatSidenavModule, MatGridListModule, MatStepperModule, MatSelectModule, MAT_LABEL_GLOBAL_OPTIONS, MatSnackBarModule, MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatDialogModule, MatDatepickerModule, MatDatepickerIntl, MAT_DATE_LOCALE} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { SidebarModule, TreeViewModule  } from '@syncfusion/ej2-angular-navigations';

import { DndModule } from 'ng2-dnd';

import { NgxPicaModule } from 'ngx-pica';

import { NgxDropzoneModule } from 'ngx-dropzone';

import { NouisliderModule } from 'ng2-nouislider';

import { FontPickerConfigInterface } from 'ngx-font-picker';
import { FontPickerModule } from 'ngx-font-picker';
import { FONT_PICKER_CONFIG } from 'ngx-font-picker';

import { ColorPickerModule } from 'ngx-color-picker';

import { NgxFormatFieldModule } from 'ngx-format-field';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { NgxImageCompressService } from 'ngx-image-compress';

import { FusionChartsModule } from 'angular-fusioncharts';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { NotesService } from './notes.service';

import { AnnoncesComponent, DialogOverviewExampleDialog } from './annonces/annonces.component';
import { CampaignSettingsComponent } from './campaign-settings/campaign-settings.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NotesListComponent } from './notes-list/notes-list.component';
import { SettingsComponent } from './campaign-settings/settings/settings.component';
import { AdGroupService } from '../notes/ad-groupe.service'
import { Ads } from '../notes/ads.service'
import { SpinnerOverlayComponent } from '../notes/spinner-overlay-notes/spinner-overlay.component'

import { getFrenchPaginatorIntl, getDatePickerIntl } from '../notes/MatPaginatorTranslate'
import {MccColorPickerModule, MccSpeedDialModule} from 'material-community-components'

 

const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  // Google API Key
  apiKey: 'AIzaSyAN1VolxTqz1jn1Fzr5LdVneCjJ-FC6JT4'
};



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ColorPickerModule ,
    HttpClientModule,
    DatePickerModule ,
    NgMultiSelectDropDownModule.forRoot(),
    NgxPicaModule,
    NouisliderModule,
    DndModule.forRoot(),
    NgbModule,
    FontPickerModule,
    LazyLoadImageModule,
    NgxFormatFieldModule,
    FusionChartsModule,
    NgxDropzoneModule,
    SidebarModule,
    TreeViewModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule,MatFormFieldModule,MatTableModule,MatInputModule,MatIconModule,MatChipsModule,MatCardModule,MatExpansionModule, MatListModule,MatMenuModule, MatPaginatorModule,MatToolbarModule, MatSidenavModule, MatGridListModule, MatStepperModule, MatSelectModule,MatSnackBarModule, MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatDialogModule ,MatDatepickerModule,MccColorPickerModule.forRoot({
      empty_color: 'transparent',
        used_colors: ['#000000', '#FFF555']
    }), 
    MccSpeedDialModule,
  
    /* ChartsModule */
 

    
    
  ],
    entryComponents: [
    DialogOverviewExampleDialog
  ],
  declarations: [NotesListComponent, NoteDetailComponent, CampaignSettingsComponent, AnnoncesComponent, SettingsComponent, CreateCampaignComponent, SpinnerOverlayComponent, DialogOverviewExampleDialog],
  providers: [NotesService, AdGroupService, Ads, NgxImageCompressService, { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl()},{ provide:MatDatepickerIntl, useValue: getDatePickerIntl()},  {provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'always'}},  {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},/*  ThemeService, { provide: FONT_PICKER_CONFIG,
      useValue: DEFAULT_FONT_PICKER_CONFIG} */],
  exports: [MatButtonModule, MatCheckboxModule]
})
export class NotesModule { }
