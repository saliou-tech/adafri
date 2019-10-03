import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatTableModule, MatInputModule, MatIconModule, MatChipsModule, MatCardModule, MatExpansionModule, MatListModule, MatMenuModule, MatPaginatorModule, MatPaginatorIntl, MatToolbarModule, MatSidenavModule, MatGridListModule, MatStepperModule, MatSelectModule, MAT_LABEL_GLOBAL_OPTIONS, MatSnackBarModule, MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatDialogModule, MatDatepickerModule, MatDatepickerIntl, MAT_DATE_LOCALE} from '@angular/material';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomePageComponent } from './home-page/home-page.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { SpinnerOverlayComponent } from './spinner-overlay-ui/spinner-overlay.component';
import { SsrPageComponent } from './ssr-page/ssr-page.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TermsComponent } from './terms/terms.component'


import {ScrollDispatchModule} from '@angular/cdk/scrolling';
// import { RootComponent } from './root/root.component';
import { PageprincipaleComponent } from './pageprincipale/pageprincipale.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { InscriptionConfirmComponent } from './inscription-confirm/inscription-confirm.component';




@NgModule({
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbModule, FormsModule, MatButtonModule, MatCheckboxModule,MatFormFieldModule,MatTableModule,MatInputModule,MatIconModule,MatChipsModule,MatCardModule,MatExpansionModule, MatListModule,MatMenuModule, MatPaginatorModule,MatToolbarModule, MatSidenavModule, MatGridListModule, MatStepperModule, MatSelectModule,MatSnackBarModule, MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, MatDialogModule ,MatDatepickerModule,ScrollDispatchModule],
  declarations: [
    UserLoginComponent,
    HomePageComponent,
    MainNavComponent,
    LoadingSpinnerComponent,
    NotificationMessageComponent,
    UserProfileComponent,
    UserFormComponent,
    SsrPageComponent,


    SpinnerOverlayComponent,


    TermsComponent,


    PageprincipaleComponent,


    UserManagementComponent,


    InscriptionConfirmComponent
  ],
  entryComponents: [
    InscriptionConfirmComponent
    
 ],
  exports: [
    MainNavComponent,
    LoadingSpinnerComponent,
    NotificationMessageComponent,
    UserProfileComponent,
    UserFormComponent,

      ]
})
export class UiModule {}
