import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './app_core/core/auth.guard';
import { NotesListComponent } from './app_core/notes/notes-list/notes-list.component';
import { HomePageComponent } from './app_core/ui/home-page/home-page.component';
import { SsrPageComponent } from './app_core/ui/ssr-page/ssr-page.component';
import { UserLoginComponent } from './app_core/ui/user-login/user-login.component';
import { SettingsComponent } from './app_core/notes/campaign-settings/settings/settings.component'
import { AnnoncesComponent } from './app_core/notes/annonces/annonces.component'
import { CreateCampaignComponent } from './app_core/notes/create-campaign/create-campaign.component'
import { UserProfileComponent } from './app_core/ui/user-profile/user-profile.component'

import {TermsComponent} from './app_core/ui/terms/terms.component'
import { UserManagementComponent } from './app_core/ui/user-management/user-management.component';


const routes: Routes = [

  { path: 'login', component: UserLoginComponent },

  { path: '', component: NotesListComponent, canActivate: [AuthGuard] },
  { path: 'CampaignList', component: NotesListComponent, canActivate: [AuthGuard] },
  { path: 'createCampaign', component: CreateCampaignComponent, canActivate: [AuthGuard]},
  { path: 'UserProfile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'confidentialite', component: SsrPageComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'userMgmt', component: UserManagementComponent },
  { path: ':money', component: NotesListComponent, canActivate: [AuthGuard] },
  { path: 'defineBudget/:idBC', component: NotesListComponent, canActivate: [AuthGuard] },
  { path: 'edit/:name/:id/:id_campagne', component: SettingsComponent, canActivate: [AuthGuard] },
  /* { path: 'new_rechargement/:key_recharge_account', component: NotesListComponent, canActivate: [AuthGuard] }, */
 /*  { path: 'account_pay/:id_campaign_to_recharge', component: NotesListComponent, canActivate: [AuthGuard] }, */
  
 
    { path: ':message/:id', component: NotesListComponent },
  { path: ':idC/:campagne_id/:budget/:dailyBudget/:numberOfDays', component: NotesListComponent, canActivate: [AuthGuard], pathMatch: 'full' },
   { path: ':idC/:budget/:dailyBudget/:numberOfDays', component: NotesListComponent,  canActivate: [AuthGuard], pathMatch: 'full' },
   
  
  { path: 'ads/:name/:idC/:idA/:ad_group_id/:campaign_id', component: AnnoncesComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  {path: 'ads/:name/:idC/:idA/:ad_group_id/:campaign_id/:type', component: AnnoncesComponent, pathMatch: 'full'},
  {path: 'ads/:name/:idC/:idA/:ad_group_id/:campaign_id/:budget/:dailyBudget/:numberOfDays', component: AnnoncesComponent},
 /*  { path: 'campaign/:id', component: CampaignSettingsComponent, canActivate: [AuthGuard] }, */
];
 

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
