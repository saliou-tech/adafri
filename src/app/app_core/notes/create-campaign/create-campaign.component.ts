import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import * as $ from 'jquery';

import { AdGroupService } from '../ad-groupe.service';
import { NotesService } from '../notes.service';
import { AuthService } from '../../core/auth.service';
import Swal from 'sweetalert2'
import {MatSnackBar} from '@angular/material'
import { Router } from '@angular/router'

import { SERVER } from '../../../../environments/environment'
import * as particules from "../../../../assets/js/particles"


declare const particlesJS: any; 

const REDIRECT_URL = SERVER.url_redirect
@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.css']
})
  
export class CreateCampaignComponent implements OnInit {
  message_to_show = ""
  campaign: FormGroup
  progressBarAddCampaign = false
  new_name = ""
  uid: string;
  notes: any;
  email: string;
  name: string;
  status: string;
  id_campagne: string;
  title: string;
  currentUser: string;
  isCreating = false;
  isExist: boolean = false
  
  constructor(private router: Router, private notesService: NotesService, private auth: AuthService, private adGroupService: AdGroupService, private fb: FormBuilder, private snackBar: MatSnackBar) { 
     this.title = "Créer une campagne"
       this.auth.user.forEach((value) => {
         this.uid = value.uid
         this.email = value.email
         this.currentUser = value.displayName
    })
  }

  goback() {
    window.location.reload()
  }


  ngOnInit() {
      this.campaign = this.fb.group({
           campaign: ['', Validators.required],
         
    });
   /*  document.querySelector('.height-full').classList.add('adafri-background') */
   /*  setTimeout(() => {
             particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 380,
      "density": {
        "enable": true,
        "value_area": 1000
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#ffffff"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "../../../../assets/img/images/campaign.png",
        "width": 1000,
        "height": 1000
      }
    },
    "opacity": {
      "value": 1,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": true
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}); 
        }, 2000) */
    
      this.auth.user.forEach((value) => {
         this.uid = value.uid
         this.email = value.email
      })

  }

  
  getCampaignIdFirebase(id, name): Promise<any>{
    return new Promise(resolve => {
      this.notesService.getSingleCampaign(id.toString(), name).subscribe(single => { 
        resolve(single[0])
      })
    })
  }


  addCampaign() {
    if (this.campaign.valid) {
      this.message_to_show = "Initialisation..."
    this.progressBarAddCampaign = true
     this.message_to_show = "Traitement en cours..."
    var name = this.new_name.replace(/\s/g, "")
    this.notesService.addCampaign(this.email, this.uid, name).then(result => {
      if (result != "error") {
        var campaign = result[0]
           this.message_to_show = "Campagne ajoutée !"
            this.openSnackBar("Félicitations "+this.currentUser+" la campagne " +name+" a été ajouté avec succès !", "")
        this.message_to_show = "Création du groupe de visuel en cours..."
         this.adGroupService.addAdGroup(campaign['campaign_id'], this.uid, name).then(adgroup => {
          if (adgroup!= "error") {
               this.message_to_show = "Opération terminée !"
                  this.openSnackBar("Votre premier groupe de visuel " +name+" a été ajouté avec succès !", "")
              this.name = '';
            
              this.progressBarAddCampaign = false
                 
                 this.message_to_show = ""
         
                
              this.router.navigate(['/ads', name, campaign['campaign_id'], adgroup[0]['id'], adgroup[0]['ad_group_id'], campaign['campaign_id']])
            }
          })
          
/*            Swal.fire({
    html: '<span class="adafri-police-16">Félicitations <span class="adafri adafri-police-16 font-weight-bold" >'+ this.currentUser+'</span> la campagne <span class="adafri adafri-police-16 font-weight-bold" >'+ name+'</span> a été ajoutée</span>',
             
      type: 'success',
      showCancelButton: false,
       buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.value) {
        this.adGroupService.addAdGroup(campaign['campaign_id'], this.uid, name).then(adgroup => {
          if (adgroup!= "error") {
              this.isCreating = false
         
                document.getElementById('body').classList.remove('adafri-background')
              this.router.navigate(['/ads', name, campaign['campaign_id'], adgroup[0]['id'], adgroup[0]['ad_group_id'], campaign['campaign_id']])
            }
          })
      } else {
            this.adGroupService.addAdGroup(campaign['id'], this.uid, name).then(adgroup => {
              if (adgroup != "error") {
                this.isCreating = false
                document.getElementById('body').classList.remove('adafri-background')
                this.router.navigate(['/ads', name, campaign['id'], adgroup[0]['id'], adgroup[0]['ad_group_id'], campaign['campaign_id']]).then(() => {
                window.location.reload()
              })
            }
          })
      }
    }) */

  
      } else {
        this.progressBarAddCampaign = false
                 
                 this.message_to_show = ""
      }
    })
    }
   
    
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      
    });
  }
  go1() {
  window.location.replace(REDIRECT_URL)
   window.location.reload()
 }
  
  go() {
    document.querySelector('.height-full').classList.remove('adafri-background')
    window.location.replace(REDIRECT_URL)
   
   /*  this.router.navigate(['/']) */
  }

}
