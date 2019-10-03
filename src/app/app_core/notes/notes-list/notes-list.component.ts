import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRoute
} from '@angular/router';

import { SidebarComponent, TreeViewComponent } from '@syncfusion/ej2-angular-navigations';

import { Observable } from 'rxjs';

import { NotesService } from '../notes.service';
import { AuthService } from '../../core/auth.service';
import { NoteDetailComponent } from '../note-detail/note-detail.component'
import { AdGroupService } from '../ad-groupe.service'
import Swal from 'sweetalert2'
import * as $ from 'jquery'
import * as moment from 'moment'
import { SERVER } from '../../../../environments/environment'
import { Router } from '@angular/router'
import * as CryptoJS from 'crypto-js'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import {MatSnackBar} from "@angular/material"
declare const particlesJS: any; 

declare const pQuery: any
declare const PayExpresse: any
declare var require: any;
//const SERVER_URL = "http://127.0.0.1:5000"
const SERVER_URL = SERVER.url
const REDIRECT_URL = SERVER.url_redirect


@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  providers: [NoteDetailComponent]
})
export class NotesListComponent implements AfterViewInit {
  progressBarAddCampaign = false
  message_to_show = ""
  new_name = ""
    @ViewChild('sidebarTreeviewInstance')
    public sidebarTreeviewInstance: SidebarComponent;
    @ViewChild('treeviewInstance')
    public treeviewInstance: TreeViewComponent;
    public width: string = '290px';
    public enableDock: boolean = true;
    public dockSize:string ="44px";
    public mediaQuery: string = ('(min-width: 600px)');
    public target: string = '.main-content';
    campaign: FormGroup
    public data: Object[] = [
        {
            nodeId: '01', nodeText: 'Installation', iconCss: 'icon-microchip icon',
        },
        {
            nodeId: '02', nodeText: 'Deployment', iconCss: 'icon-thumbs-up-alt icon',
        },
        {
            nodeId: '03', nodeText: 'Quick Start', iconCss: 'icon-docs icon',
        },
        {
            nodeId: '04', nodeText: 'Components', iconCss: 'icon-th icon',
            nodeChild: [
                { nodeId: '04-01', nodeText: 'Calendar', iconCss: 'icon-circle-thin icon' },
                { nodeId: '04-02', nodeText: 'DatePicker', iconCss: 'icon-circle-thin icon' },
                { nodeId: '04-03', nodeText: 'DateTimePicker', iconCss: 'icon-circle-thin icon' },
                { nodeId: '04-04', nodeText: 'DateRangePicker', iconCss: 'icon-circle-thin icon' },
                { nodeId: '04-05', nodeText: 'TimePicker', iconCss: 'icon-circle-thin icon' },
                { nodeId: '04-06', nodeText: 'SideBar', iconCss: 'icon-circle-thin icon' }
            ]
        },
        {
            nodeId: '05', nodeText: 'API Reference', iconCss: 'icon-code icon',
            nodeChild: [
                { nodeId: '05-01', nodeText: 'Calendar', iconCss: 'icon-circle-thin icon' },
                { nodeId: '05-02', nodeText: 'DatePicker', iconCss: 'icon-circle-thin icon' },
                { nodeId: '05-03', nodeText: 'DateTimePicker', iconCss: 'icon-circle-thin icon' },
                { nodeId: '05-04', nodeText: 'DateRangePicker', iconCss: 'icon-circle-thin icon' },
                { nodeId: '05-05', nodeText: 'TimePicker', iconCss: 'icon-circle-thin icon' },
                { nodeId: '05-06', nodeText: 'SideBar', iconCss: 'icon-circle-thin icon' }
            ]
        },
        {
            nodeId: '06', nodeText: 'Browser Compatibility', iconCss: 'icon-chrome icon'
        },
        {
            nodeId: '07', nodeText: 'Upgrade Packages', iconCss: 'icon-up-hand icon'
        },
        {
            nodeId: '08', nodeText: 'Release Notes', iconCss: 'icon-bookmark-empty icon'
        },
        {
            nodeId: '09', nodeText: 'FAQ', iconCss: 'icon-help-circled icon'
        },
        {
            nodeId: '10', nodeText: 'License', iconCss: 'icon-doc-text icon'
        }
    ];
    public field:Object ={ dataSource: this.data, id: 'nodeId', text: 'nodeText', child: 'nodeChild', iconCss: 'iconCss' };

    public onCreated(args: any) {
         this.sidebarTreeviewInstance.element.style.visibility = '';
    }
    public onClose(args: any) {
        this.treeviewInstance.collapseAll();
    }
    openClick() {
        if(this.sidebarTreeviewInstance.isOpen)
        {
            this.sidebarTreeviewInstance.hide();
            this.treeviewInstance.collapseAll();
        }
        else {
            this.sidebarTreeviewInstance.show();
            this.treeviewInstance.expandAll();
        }  
    }
   @ViewChild(NoteDetailComponent) child: NoteDetailComponent;

  

  @Input() icon_1 = "icon icon-inbox text-purple s-18"
  @Input() icon_2 = "icon icon-star-o lime-text s-18"
  @Input() icon_3 = ""
  @Input() icon_4 = ""
  @Input() icon_5 = ""

  text_1 = "Liste des camapagnes"
  text_2 = "Ajouter une campagne"
  text_3 = ""
  text_4 = ""
  text_5 = ""

   @Input() icon_retour = "icon-long-arrow-left"
  @Input() btn_retour = "btn-fab btn-fab-sm shadow btn-primary"

  action_2 = () => {this.toggleAddCampaignBlock()}
  montant: any;

  email_letter: any;
  @Input()
  currentUser: any;
  notes: Observable<any[]>;
  name: string;
  id: string;
  id_campagne: string;
  status: string;
  uid: string;
  email: string;
  title = "";
  isCampaign = false;
  ad_group_id: string;
  adgroups: any;
  dure_campagne = 0
  photoURL = ""
  //Si aucune campagne le bloc pour crÃ©er une nouvelle campagne
  _addCampaign_ = false;

  _init_campagne = false;

  //Le bloc pour afficher la liste des campagnes
  showList = false
  accountValue: any;
  //Le bloc pour afficher la page pour une campagne donnÃ©e
  _showCampaignSettings_ = false
  isCreating = false
  notificationAccountValue = "";
  numberOfNotifications = 0

  constructor(private notesService: NotesService, public auth: AuthService, private http: HttpClient, private adgroup_service: AdGroupService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) {
      var self = this
    
    this.auth.user.forEach(data => {
      this.currentUser = data.displayName
    })
    
    this.auth.notificationAccount.forEach((value) => {
      if(value.notification != ""){
        this.numberOfNotifications = 1
        this.notificationAccountValue = value.notification
      
      }
    })
  }
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      
    });
  }
  ngAfterViewInit() {
  //var init_note = new NotesService(this.uid)
  
    this._showCampaignSettings_ = this.child._showCampaignSettings_


   

 
    
   
  }

  decryptMoney(encrypted: string, uid: string): Promise<any> {

    return new Promise(resolve => {
      var status = []
      var CryptoJS = require( 'crypto-js' );
    var cipherParams = CryptoJS.lib.CipherParams.create(
               {ciphertext: CryptoJS.enc.Hex.parse(encrypted.toString())});
localStorage.getItem("")
var bytes = CryptoJS.AES.decrypt(cipherParams,CryptoJS.enc.Hex.parse(uid),
            { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding });

    ////console.log('Decrypted:' + bytes.toString(CryptoJS.enc.Utf8));
   
      status.push({
        "status": "ok",
        "content":  bytes.toString(CryptoJS.enc.Utf8)
      })
      resolve(status)
   })
  }




  getCurrentUserCredentials(): Promise<any>{
    return new Promise(resolve => {
      var response = []
       this.auth.user.forEach(data => {
        response.push({
          "uid": data.uid,
          "account_value": data.account_value,
          "paymentKey": data.paymentKey
        })
          
          resolve(response)
          
        })
    })
  } 

/*  getCurrentUserCredentials(){
    
      var response = []
       this.auth.user.forEach(data => {
        response.push({
          "uid": data.uid,
          "account_value": data.account_value,
          "paymentKey": data.paymentKey
        })
        //console.log(data)
      })
   
  }
 */

  getCurrentAccountValue(): Promise<number> {
    return new Promise(resolve => {
      this.auth.user.forEach(data => {
        resolve(data.account_value)
      })
    })
  }

  getCurrentUserId(): Promise<string>{
    return new Promise(resolve => {
      this.auth.user.forEach(data => {
        resolve(data.uid)
      })
    })
  }


  getPaymentKey(): Promise<string>{
    return new Promise(resolve => {
      this.auth.user.forEach(data => {
        resolve(data.paymentKey)
      })
    })
  }


  getNotificationId(uid: string): Promise<string>{
    return new Promise(resolve => {
      this.auth.getNotificationData(uid).forEach(data => {
        resolve(data[0]['id'])
      })
    })
  }

  ngOnInit() {
    
       this.auth.user.forEach((value) => {
        
         this.uid = value.uid
         this.email = value.email
         this.accountValue = value.account_value
        
         this.email_letter = value.email.charAt(0)
         this.photoURL = value.photoURL
         this.notes = this.notesService.getListCampaign(value.uid)
         this.notes.forEach(child => {
          
      //////console.log(child.length)
      if (child.length > 0) {
        //////console.log(child.length)
        this.toggleListCampaign()
       /*   document.querySelector('.height-full').classList.remove('adafri-background') */
      } else {
        this.initCampagne()
      /*   document.querySelector('.height-full').classList.add('adafri-background') */
         this.campaign = this.fb.group({
           campaign: ['', Validators.required],
         
    });
        /* setTimeout(() => {
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
      "value": 0.3,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
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
      }
    })
       })

    this.route.params.subscribe(params => { 
        
      if (params['idBC'] !== undefined) {
        this.isCreating = true
        setTimeout(() => {
          this.isCreating = true
                   
          document.getElementById(params['idBC']).click()
        }, 1500)
        setTimeout(() => {
                   
          document.getElementById("v-pills-payments-tab").click()
          this.isCreating = false
              
        }, 1500)
        setTimeout(() => {
                   
          document.getElementById("button_define_budget").click()
          this.isCreating = false
        }, 1500)
        this.isCreating = false
      } else if (params['message'] !== undefined) {
        var message = params['message']
        var id = params['id']
        
        this.getCurrentUserCredentials().then(credentials => {
          //console.log(credentials)
          var paymentKey = credentials[0]['paymentKey']
          this.uid = credentials[0]['uid']
          this.accountValue = credentials[0]['account_value']
          var montant = localStorage.getItem(paymentKey)
          if (montant === null) {
              this.isCreating = false
          } else {
            this.isCreating = true
              var new_value = 0
              if (this.accountValue > new_value) {
                //console.log("Solde du compte non null")
                //console.log("solde actuel: " + this.accountValue.toString())
                new_value = parseInt(montant) + this.accountValue
                //console.log("Nouveau solde: "+new_value.toString())
              } else {
                  //console.log("Solde du compte null")
                  //console.log("solde actuel: " + this.accountValue.toString())
                  new_value = parseInt(montant)
                  //console.log("Nouveau solde: "+new_value.toString())
                }
              this.auth.updateUser(this.uid, { account_value: new_value, paymentKey: "" }).then(res => {
              if (res != "error") {
                this.getNotificationId(this.uid).then(res => {
                this.auth.updateNotification
                (res, { notification: "" }).then(() => {
                Swal.fire({
                  title: 'Service Rechargement!',
                  text: 'Compte mis à jour avec succès.',
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.value) {  
                      localStorage.removeItem(paymentKey)
                      this.isCreating = false
                      if (message !== 'success') {
                        
                        document.getElementById(id).click()

                      } else {
                          this.router.navigate(['/'])
                      } 
                    }
                  })
                })
                })
              }
              })
            }
        }) 
  
      }/* else if(params['id_campaign_to_recharge'] !== undefined){
                   this.auth.user.forEach(data => {
                     var key = params['id_campaign_to_recharge']
                       window.history.pushState("", "", REDIRECT_URL)
                var montant = localStorage.getItem(key)
                if (montant === null) {
                  this.isCreating = false
                } else {
                  var value = 0
                  if (this.accountValue > 0) {
                    value = parseInt(montant) + this.accountValue
                  } else {
                    value = parseInt(montant)
                  }
                                     this.auth.updateUser(data.uid, { account_value: value })
          this.auth.getInfos(data.uid).subscribe(el => {
            this.auth.updateNotification(el[0]['id'], { notification: "" }).then(() => {
              Swal.fire({
                title: 'Service Rechargement!',
                text: 'Compte mis à jour avec succès.',
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  //this.router.navigate(['/'])
                  localStorage.removeItem(key)
                
          
                  this.isCreating = false
                }
              })
            })
      
   
          })
                }
                
              })
      } */ else  if (params['idC'] !== undefined && params['campagne_id'] !== undefined && params['budget'] !== undefined && params['dailyBudget'] !== undefined && params['numberOfDays'] !== undefined) {
        this.isCreating = true
        var idC = params['idC']
        var id_campagne = params['campagne_id']
        
        var dailyBudget = params['dailyBudget']
        var numberOfDays = params['numberOfDays']
        
         this.getCurrentUserCredentials().then(credentials => {
          var paymentKey = credentials[0]['paymentKey']
           var montant = localStorage.getItem(paymentKey)
          if (montant === null) {
            this.isCreating = false
          } else {
            this.isCreating = true
            var budget = parseInt(montant)
             this.notesService.updateNote(idC, { budget: budget , dailyBudget: dailyBudget, numberOfDays: numberOfDays}).then(() => {
                Swal.fire({
                  title: 'Service Campagne!',
                  text: 'Budget mis à jour.',
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ok'
                }).then((result) => {
                  if (result.value) {
                    //this.router.navigate(['/'])
                    this.isCreating = false
                    localStorage.removeItem(paymentKey)
               
                    setTimeout(() => {
                      
                      document.getElementById(idC).click()
                    }, 1500)

                  }
                })
                
              })
          
          } 
        })
        // In a real app: dispatch action to load the details here.
      }else {
        
        this.router.navigate(['/'])
      
      }
    })
     

    this.route.params.subscribe(params => {
        /*     if (window.location.href.includes('defineBudget')) {
         setTimeout(() => {
                   
                    document.getElementById(params['idC']).click()
         }, 2000)
       
            setTimeout(() => {
                   
              document.getElementById("v-pills-payments-tab").click()
              this.isCreating = false
              
            }, 2000)
         setTimeout(() => {
                   
              document.getElementById("button_define_budget").click()
           this.isCreating = false
           
           window.history.pushState("","",REDIRECT_URL)
              
                  }, 2000)
            } else */ /* if (window.location.href.includes('account_pay')) {
              this.auth.user.forEach(data => {
                var key = params['idC']
                var montant = localStorage.getItem(key)
                if (montant === null) {
                  this.isCreating = false
                } else {
                                     this.auth.updateUser(data.uid, { account_value: parseInt(montant) })
          this.auth.getInfos(data.uid).subscribe(el => {
            this.auth.updateNotification(el[0]['id'], { notification: "" }).then(() => {
              Swal.fire({
                title: 'Service Rechargement!',
                text: 'Compte mis à jour avec succès.',
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  //this.router.navigate(['/'])
                  localStorage.removeItem(key)
                  window.history.pushState("", "", REDIRECT_URL)
          
                  this.isCreating = false
                }
              })
            })
      
   
          })
                }
                
              })
            } */ /* else if (window.location.href.includes('new_rechargement')) {
          
                         this.isCreating = true
              this.auth.user.forEach(data => {
                //alert(params['idC'])
                var montant = localStorage.getItem(params['id_campaign_to_recharge'])
                ////console.log(montant)
                if (montant === null) {
                  
                  this.isCreating = false
                } else {
                     this.isCreating = false
                   this.auth.updateUser(data.uid, { account_value: parseInt(montant) })
                  this.auth.getInfos(data.uid).subscribe(el => {
                    this.auth.updateNotification(el[0]['id'], { notification: "" }).then(() => {
                      Swal.fire({
                        title: 'Service Rechargement!',
                        text: 'Compte mis à jour avec succès.',
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                      }).then((result) => {
                        if (result.value) {
                          //this.router.navigate(['/'])
                          window.history.pushState("", "", REDIRECT_URL)
                          localStorage.removeItem(params['idC'])
                          this.isCreating = false
                     
                    
                        }
                      })
                    })
              
           
                  })
               
                }
        })
              
      } */
  
/*       if (typeof (params['money']) != "undefined") {
        this.isCreating = true
        
        this.auth.user.forEach(data => {

          var mystr = this.decrypted(params['money'], data.uid)
          if(parseInt(mystr)!==NaN){
            
            
  
          }

       
          
         
           
          
        })
        
        

        // In a real app: dispatch action to load the details here.
      } */


/*       if (typeof (params['money']) != "undefined" && typeof (params['idC']) != "undefined") {
         
         if (params['money'] == 0) {
          
            setTimeout(() => {
                   
                    document.getElementById(params['idC']).click()
                  }, 2000)
            setTimeout(() => {
                   
              document.getElementById("v-pills-timeline-tab").click()
              this.isCreating = false
              
                  }, 2000)
        }else{
           this.isCreating = true
        this.auth.user.forEach(data => {
          this.auth.updateUser(data.uid, { account_value: params['money'] })
          this.auth.getInfos(data.uid).subscribe(el => {
            this.auth.updateNotification(el[0]['id'], { notification: "" }).then(() => {
              Swal.fire({
                title: 'Service Rechargement!',
                text: 'Compte mis à jour avec succès.',
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  //this.router.navigate(['/'])
                  window.history.pushState("", "", REDIRECT_URL)
                  this.isCreating = false
                  document.getElementById(params['idC']).click()
                  setTimeout(() => {
                   
                     document.getElementById("v-pills-timeline-tab").click()
                  }, 2000)
            
                }
              })
            })
      
   
          })
        })
        }

        // In a real app: dispatch action to load the details here.
      } */

  /*      if (typeof (params['idC']) != "undefined" && typeof(params['campagne_id']) && params['budget'] != "undefined" && params['dailyBudget'] != "undefined" && params['numberOfDays'] != "undefined") {
        this.isCreating = true
    
         
              this.notesService.updateNote(params['idC'], { budget: params["budget"] , dailyBudget: params['dailyBudget'], numberOfDays: params['numberOfDays']}).then(() => {
                Swal.fire({
                  title: 'Service Campagne!',
                  text: 'Budget mis à jour.',
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ok'
                }).then((result) => {
                  if (result.value) {
                    //this.router.navigate(['/'])
                    window.history.pushState("", "", REDIRECT_URL)
                    this.isCreating = false
                    document.getElementById(params['idC']).click()
                  }
                })
                
              })
     

        // In a real app: dispatch action to load the details here.
      } */
    })
   /* $(document).ready(() => {

  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('pay');
  var timerInterval;

     if (myParam != undefined) {
       const money = urlParams.get('money');
    this.auth.user.forEach(data=>{
      
      this.auth.updateValueAccount(data.uid, money).then(res => {
                    if (res == "ok") {
                      Swal.fire({
      title: 'Service Rechargement!',
      text: 'Compte mis à jour avec succès.',
      type: 'success',
      showCancelButton: false,
       buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.value) {
        window.history.pushState("", "","/")
      }
    })
                    }
                  })
    })
  } else {
    
  } 
}); */
  }




// INIT
/*  */;


// PROCESS
  
  
  
  generate(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

encrypted(text, password){

  return CryptoJS.AES.encrypt(text, password);
}
  decrypted(encrypted, password) {
    
    return CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8)
    ;
  }




  go1() {
    window.location.reload()
  }

  go() {
    
  window.location.replace(SERVER.url_redirect)
}

  initCampagne() {
    document.getElementById('body').classList.add('adafri-background')
    this._init_campagne = true
    this.title = "Aucune campagne trouvÃ©e"
    this.showList = true
  }

  toggleListCampaign() {
  
    this._addCampaign_ = false
    this.showList = false
    
  
     //this.child._showCampaignSettings_=false

  /*   this.title = "Liste des campagnes" */
  }

  newCampaign() {
    this._addCampaign_ = true 
    this.title = "Ajouter une nouvelle campagne"
  }

  showCampaign() {
    this._showCampaignSettings_=true
    this.showList = false
    this._addCampaign_ = false
    this.title = "Paramètre de campagne"
  }


  toggleCampaign() {
   
    this.isCampaign = true
 
  }
  toggleAddCampaignBlock() {
    /* this._addCampaign_ = true
    this.showList = true
    this.child._showCampaignSettings_ = false
   
    */
   
  this.router.navigate(['createCampaign'], {skipLocationChange: true})    
  }

  goBack() {
    this._addCampaign_=false
  }

  getCampaignIdFirebase(id, name): Promise<any>{
    return new Promise(resolve => {
      this.notesService.getSingleCampaign(id.toString(), name).subscribe(single => { 
        resolve(single[0])
      })
    })
  }

 

    clickHandler(id: any, name: string, status: string, startDate: string, endDate: string, startDateFrench: string, endDateFrench: string, servingStatus: string, budgetId: any) {
    
      ////console.log(this.uid)
      ////console.log(name)
      ////console.log(status)
      
      this.notesService.createCampaign(id, name, status, startDate, endDate, startDateFrench, endDateFrench, servingStatus, budgetId
      ).then(res => {
     
        if (res != "error") {
          this.getCampaignIdFirebase(id, name).then(single => {
            //console.log('campagne')
            //console.log(single['id_campagne'])
            this.message_to_show = "Campagne ajoutée !"
            this.openSnackBar("Félicitations "+this.currentUser+" la campagne " +name+" a été ajouté avec succès !", "")
            this.message_to_show = "Création du groupe de visuel en cours..."
             this.adgroup_service.addAdGroup(id, this.uid, name).then(adgroup => {
               if (adgroup != "error") {
                 this.message_to_show = "Opération terminée !"
                  this.openSnackBar("Votre premier groupe de visuel " +name+" a été ajouté avec succès !", "")
              this.name = '';
              this.id_campagne = '';
              this.progressBarAddCampaign = false
                 this._init_campagne = false
                 this.message_to_show = ""
            /*     document.getElementById('body').classList.remove('adafri-background') */
            this.router.navigate(['/ads', name, single['id'], adgroup[0]['id'], adgroup[0]['ad_group_id'], single['id_campagne']]).then(() => {
          
              })
            }
          })
          })

        } else {
          this.progressBarAddCampaign  = false
        }
      })
  
   
  }
  addCampaign() {   

    if (this.campaign.valid) {
    this.message_to_show = "Initialisation..."
    this.progressBarAddCampaign = true
    var name = this.new_name.replace(/\s/g, "")
    

    this.http.post(SERVER_URL+'/addCampaign', {
      'email': this.email,
      'campaign_name': name
    })
      .subscribe(
        res => {
          ////console.log(res)
          ////console.log(res['budgetId'])
          this.message_to_show = "Traitement en cours..."
          if (res['status'] == "ok") {
            this.id_campagne = res['id']
            this.status = res['status_campaign']
            this.ad_group_id = res['ad_group_id']
            this.clickHandler(this.id_campagne, name, this.status, res['startDate'], res['endDate'], res['startDateFrench'], res['endDateFrench'], res['servingStatus'], res['budgetId'])
            
          } else {
          
            this.progressBarAddCampaign = false    
            this.message_to_show = ""
            Swal.fire({
              title: 'Service Campagne!',
              text: 'Erreur.',
              type: 'error',
              showCancelButton: false,
              buttonsStyling: true,
      
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) { 
              }
            })
          
          
          }
        
        },
        err => {
          this.progressBarAddCampaign = false
          Swal.fire({
      title: 'Service Campagne!',
      text: 'Erreur.',
      type: 'error',
      showCancelButton: false,
       buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.value) {}
    })
        }
      );
 
    return;              
    }
    
  }
    async loadScript(src){
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = src;
    
  }

  defineAmountAccount() {
    var self = this
    var browser = ""
      var redirect = ""
        
        this.notesService.detectDevice().then(res => {
          browser = res
           if (browser === "Opera") {
        redirect = SERVER.opera
      } else if (browser === "Chrome") {
        redirect = SERVER.chrome
      } else if(browser === "Safari") {
        var current_browser_url = window.location.href
        if (current_browser_url.includes("www")) {
          redirect = SERVER.safari1
        } else {
          redirect = SERVER.safari2
        }
          }
              this.montant = $("#montant").val()
    if (this.montant < 20000) {
      $('#error_recharge').show()
    } else if (this.montant > 1000000) {
       Swal.fire({
          title: "Service rechargement",
          text: "Montant trop élevé",
          type: 'warning',
          showCancelButton: true,
           confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'réessayer '
        }).then((result) => {
          if (result.value) {
          
          }
        })
    } else{
      var key = this.generate(100)
      localStorage.setItem(key, this.montant.toString())
      this.auth.updateUser(this.uid, {paymentKey: key})
      $('#closeModalRecharge').trigger('click')
      var self = this
      Swal.fire({
          title: "Service rechargement",
          html: "<span>Vous allez procéder au paiement dans quelques instant saisissez le <strong class='adafri font-weight-bold adafri-police-18'>#144#391#</strong> sur votre téléphone pour payer avec orange money<span>",
          type: 'info',
          showCancelButton: true,
           confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
        confirmButtonText: 'Procéder au paiement',
          cancelButtonText: "annuler"
        }).then((result) => {
          if (result.value) {
                 this.isCreating = true
      setTimeout(function () {
    
        var btn = document.getElementById("amountSet");
        var selector = pQuery(btn);
        (new PayExpresse({
          item_id: 1,
        })).withOption({
            requestTokenUrl: SERVER_URL+'/rechargeAmount/'+ self.montant+"/rechargement/"+redirect,
            method: 'POST',
            headers: {
                "Accept": "application/json"
          },
       
          
            //prensentationMode   :   PayExpresse.OPEN_IN_POPUP,
            prensentationMode: PayExpresse.OPEN_IN_POPUP,
            didPopupClosed: function (is_completed, success_url, cancel_url) {
              self.isCreating = false
              if (is_completed === true) {
                  //alert(success_url)
                
                  //window.location.href = success_url; 
                } else {
                  self.isCreating = false
                    //window.location.href = cancel_url
                }
            },
            willGetToken: function () {
                ////console.log("Je me prepare a obtenir un token");
                selector.prop('disabled', true);
                //var ads = []


            },
            didGetToken: function (token, redirectUrl) {
                ////console.log("Mon token est : " + token + ' et url est ' + redirectUrl);
              //console.log('redirec_url')
                selector.prop('disabled', false);
            },
            didReceiveError: function (error) {
                //alert('erreur inconnu');
                selector.prop('disabled', false);
            },
            didReceiveNonSuccessResponse: function (jsonResponse) {
                ////console.log('non success response ', jsonResponse);
                //alert(jsonResponse.errors);
                selector.prop('disabled', false);
            }
        }).send({
            pageBackgroundRadianStart: '#0178bc',
            pageBackgroundRadianEnd: '#00bdda',
            pageTextPrimaryColor: '#333',
            paymentFormBackground: '#fff',
            navControlNextBackgroundRadianStart: '#608d93',
            navControlNextBackgroundRadianEnd: '#28314e',
            navControlCancelBackgroundRadianStar: '#28314e',
            navControlCancelBackgroundRadianEnd: '#608d93',
            navControlTextColor: '#fff',
            paymentListItemTextColor: '#555',
            paymentListItemSelectedBackground: '#eee',
            commingIconBackgroundRadianStart: '#0178bc',
            commingIconBackgroundRadianEnd: '#00bdda',
            commingIconTextColor: '#fff',
            formInputBackgroundColor: '#eff1f2',
            formInputBorderTopColor: '#e3e7eb',
            formInputBorderLeftColor: '#7c7c7c',
            totalIconBackgroundRadianStart: '#0178bc',
            totalIconBackgroundRadianEnd: '#00bdda',
            formLabelTextColor: '#292b2c',
            alertDialogTextColor: '#333',
            alertDialogConfirmButtonBackgroundColor: '#0178bc',
          alertDialogConfirmButtonTextColor: '#fff',
          
        });
    }, 500)
          }
        })


      
      
      
    }
        })
     

  }
  
}
