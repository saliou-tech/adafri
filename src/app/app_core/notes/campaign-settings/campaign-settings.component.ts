import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  Params
} from '@angular/router';
import {
  Location
} from '@angular/common';

import * as $ from 'jquery';

import { Observable } from 'rxjs';

import Swal from 'sweetalert2';

import {
  AuthService
} from '../../core/auth.service';


import { NotesService } from '../notes.service'

@Component({
  selector: 'app-campaign-settings',
  templateUrl: './campaign-settings.component.html',
  styleUrls: ['./campaign-settings.component.css']
})
export class CampaignSettingsComponent implements OnInit {

  user: any;
  campaign: Observable < any[] > ;

  @Input() id_campagne: string;
  @Input() name: string;
  @Input() id: string;
  @Input() status: string;
  @Input() ad_group_id: string;
  @Input() budget: any;
  @Input() budgetId: any;
  @Input() dailyBudget : any;
  @Input() numberOfDays: any
  uid: string;
  email: string;
  isEditor = false;
  isCampaignSettings = true;
  title: any;
  campagne: any;



  @Input() _showCamp: any;

  constructor(private notesService: NotesService, private auth: AuthService, private location: Location) {
    this.title = "Campaign Management"
    this.auth.user.forEach((value) => {
      this.uid = value.uid
      this.email = value.email
    })

  }
  toggleEditor() {
   
  }
  toggleCampaignSettings() {
    this.isEditor = false
    this.isCampaignSettings = true
  }

  goBack() {
    this.location.back();
  }
  ngOnInit() {
 /*    this.campagne = this.notesService.getData()
      .forEach(snap => {
        if (snap = []) {
          this.isCampaignSettings = false
        }
      }) */

  }
  createAdGroup() {
    
  }
  /* deleteCampaign() {
    Swal.fire({
      title: 'Vous voulez vraiment supprimer cette campagne?',
      text: "Cette action sera irréversible!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.value) {
        var data = {
          "id": this.id_campagne
        }
        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:5000/deleteCampaign",
          datatype: "json",
          contentType: 'application/json',
          success: function (response) {
            console.log(response)
            if (response.status == "ok") {
              console.log(response.handler)

            }
          },
          error: function (err) {
            console.log(err)
          },

          data: JSON.stringify(data),
        }).then((res) => {

          this.notesService.deleteNote(this.id);
          Swal.fire({
            title: 'Supprimer!',
            text: 'Votre campagne a été supprimée avec succès.',
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.value) {
              window.location.reload()

            }
          })


        }).catch(err => {
          Swal.fire(
            'Erreur!',
            'Une erreur est survenue lors de la suppression de votre campagne',
            'error'
          )
        })

      }
    })

  } */





}
