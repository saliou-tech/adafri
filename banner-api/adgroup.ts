import { Injectable, OnInit, Self, Optional } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import Swal from 'sweetalert2';

import * as firebase from 'firebase/app';

import { AuthService } from '../../app_core/core/auth.service';

import { Note } from './note.models';
import {map} from 'rxjs/operators'
import * as moment from 'moment'

import { AdGroupService } from './ad-groupe.service'
import { Ads } from './ads.service'
import {SERVER} from '../../../environments/environment'

const SERVER_URL = SERVER.url


@Injectable()
export class NotesService implements OnInit {
  currentUser: any;
  uid: any;
  isLoading: boolean;
  note: Note;
  today: Date = new Date();
  item: any;
  text_error_date = "Cette campagne a déjà commencé"
  error_end_date = "Date invalide ou campagne déjà terminée"
  private notesCollection: AngularFirestoreCollection<Note>;
  
 
  
   

  constructor(private auth: AuthService, private afs: AngularFirestore, private http: HttpClient,  private adGroupService: AdGroupService, private adsService : Ads) {
    this.auth.user.forEach(child => {
      this.uid =child.uid
      this.notesCollection = this.afs.collection('notes', (ref) => ref.where('owner', '==', child.uid));
      this.currentUser = child.displayName
    })
  }
  ngOnInit() { 

  }

  campaignVerification(user_id: string, name: string) {
     return new Promise(resolve => {
      setTimeout(() => {
        this.afs.collection('notes', (ref) => ref.where('owner', '==', `${user_id}`).where('name', '==', `${name}`)).snapshotChanges().subscribe(data => {
          this.item = data
          resolve(data.length)
      })
      }, 2000);
    });
  }

  
  
  async addCampaign(email: string, user_id: string, name: string): Promise<any> {
 
    return await new Promise(resolve => {
      this.campaignVerification(user_id, name).then(value => {
      //console.log(`promise result: ${value}`)

      if (`${value}` == '0') {
        
        this.http.post(SERVER_URL+'/addCampaign', {
       'email': email,
       'campaign_name': name
    })
      .subscribe(
        res => {
        
     
          if (res['status'] == "ok") {
            console.log(res)
            //console.log(res['startDateFrench'])
            this.createCampaign(res['id'], name, res['status_campaign'], res['startDate'], res['endDate'], res['startDateFrench'], res['endDateFrench'], res['servingStatus'], res['budgetId']).then(res => {
              console.log('from campaign service')
              console.log("campaign created with name "+ name)
              console.log(res)
              this.getSingleCampaignWithId(user_id, res['id']).then(single => {
                console.log('getting single campaign credentials')
                console.log(single)
                var response = []
                response.push({
                  "id": single['id'],
                  "campaign_id": res['id']
                })
                console.log(response)
                resolve(response)
        /*         Swal.fire({
                  html: '<span class="adafri-police-16">Félicitations <span class="adafri adafri-police-16 font-weight-bold" >'+ this.currentUser+'</span> la campagne <span class="adafri adafri-police-16 font-weight-bold" >'+ name+'</span> a été ajoutée</span>',
                 
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ok'
                }).then((result) => {
                  if (result.value) {
                  }else{
                    resolve(response)
                  }
                }) */
                })
         })
          } else {
             Swal.fire({
          title: 'Ajouter une nouvelle campagne',
          text: 'Erreur Service',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.value) {
              resolve('error')
          } else {
            resolve('error')
            }
          })
          }
       
          
        },
        err => {
          Swal.fire({
          title: 'Ajouter une nouvelle campagne',
          text: 'Erreur Service',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.value) {
              resolve('error')
          } else {
            resolve('error')
            }
          })
        }
      );

      } else{
        Swal.fire({
          title: 'Ajouter une nouvelle campagne',
          text: 'Cette camapagne exite déjà',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.value) {
              resolve('error')
          } else {
            resolve('error')
            }
          })
        
      }
    })
    })
   
  } 

/*    async addCampaign(email: string, user_id: string, name: string): Promise<any> {
 
    return await new Promise(resolve => {
      this.campaignVerification(user_id, name).then(value => {
      //console.log(`promise result: ${value}`)

      if (`${value}` == '0') {
        
        this.http.post(SERVER_URL+'/addCampaign', {
       'email': email,
       'campaign_name': name
    })
      .subscribe(
        res => {
        
        
          if (res['status'] == "ok") {
            //console.log(res)
            //console.log(res['startDateFrench'])
              this.createCampaign(res['id'], name, res['status_campaign'], res['startDate'], res['endDate'], res['startDateFrench'], res['endDateFrench'], res['servingStatus'], res['budgetId']).then(res=>{
            Swal.fire({
              html: '<span class="adafri-police-16">Félicitations <span class="adafri adafri-police-16 font-weight-bold" >'+ this.currentUser+'</span> la campagne <span class="adafri adafri-police-16 font-weight-bold" >'+ name+'</span> a été ajoutée</span>',
             
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) {
                this.adGroupService.addAdGroup(res['id'], user_id, name).then(res => {
                  if (res != "error") {
                    resol
                  }
                })
              }else{
             
              }
            })
         })
          } else {
             Swal.fire({
          title: 'Ajouter une nouvelle campagne',
          text: 'Erreur Service',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.value) {
              resolve('error')
          } else {
            resolve('error')
            }
          })
          }
       
          
        },
        err => {
          Swal.fire({
          title: 'Ajouter une nouvelle campagne',
          text: 'Erreur Service',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.value) {
              resolve('error')
          } else {
            resolve('error')
            }
          })
        }
      );

      } else{
        Swal.fire({
          title: 'Ajouter une nouvelle campagne',
          text: 'Cette camapagne exite déjà',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.value) {
              resolve('error')
          } else {
            resolve('error')
            }
          })
        
      }
    })
    })
   
  } */

    targetLocation(id: string, campaign_id: string, name: string, location: any): Promise<any> {
 
      return new Promise(resolve => {
      this.getCampaignZones(campaign_id, name).then(value => {
      //console.log(`promise result: ${value}`)

      
        
        this.http.post(SERVER_URL+'/targetLocation', {
       'campaign_id': campaign_id,
       'location_id': location[0].item_id
    })
      .subscribe(
        res => {
          //console.log(`res from location backend: ${res}`)
          this.updateNote(id, { zones: location }).then(res => {
            if (res == "ok") {
              resolve('ok')
            }
          })
        },
        err => {
          Swal.fire({
          title: 'Ciblage',
          text: 'Erreur Service',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.value){}
          })
        }
      );

     /*  } else{
        Swal.fire({
          title: 'Ciblage',
          text: 'Erreur service1',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.value){}
          })
        
      } */
    })
    })
   
  }
  getListCampaign(uid: any) {
   
   
   //console.log(uid)
 return this.afs.collection('notes', (ref) => ref.where('owner','==',`${uid}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

    
  
  }
  updateTargetLocation(id: string, campaign_id: string, name: string, location: any) {
 
    return this.getCampaignZones(campaign_id, name).then(value => {
      

      //console.log(`promise result: ${value['item_id']}`)
      //console.log(`location id from me ${location[0].item_id}`)
      //console.log(`location id from firestore ${value[0].item_id}`)
      
      
        this.http.post(SERVER_URL+'/updateLocation', {
          'campaign_id': campaign_id,
          'previous_location': value[0]['item_id'],
          'location_id': location[0].item_id
       
    })
      .subscribe(
        res => {
          //console.log(`res from location backend: ${res}`)
          this.updateNote(id, {zones: location })
        },
        err => {
          Swal.fire({
          title: 'Ciblage',
          text: 'Erreur Service',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.value){}
          })
        }
      );

     /*  } else{
        Swal.fire({
          title: 'Ciblage',
          text: 'Erreur service1',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.value){}
          })
        
      } */
    })
   
  }


  async targetAge(id: string, campaign_id: string, age: any, uid: any) {

   return await this.getSingleCampaignWithId(uid, campaign_id).then(value => {
  
     //console.log(`value:`)
     //console.log(value)
     //console.log(`age:`)
     //console.log(age)
  
  /*    var tab = _.differenceWith(value, genre, _.isEqual)
     //console.log(tab)
     if (tab = []) {
       //console.log(`genre déjà ciblé`)
     } else {
        
     }*/
      
        
        this.http.post(SERVER_URL+'/targetAgeLevelCampaign', {
       'campaign_id': campaign_id,
          'previous_ages': value['criterion_ages'],
       'ages': age
    })
      .subscribe(
        res => {
          //console.log(`res from location backend: ${res}`)
          this.updateNote(id, {ages: age, criterion_ages: res})
        },
        err => {
          Swal.fire({
          title: 'Ciblage',
          text: 'Erreur Service',
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.value){}
          })
        }
      );

    })
   
  }

  getSingleCampaign(campaign_id: string, name: string) {
    
   
 return this.afs.collection('notes', (ref) => ref.where('name', '==', `${name}`).where('owner', '==', this.uid).where('id_campagne','==',parseInt(`${campaign_id}`))).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

    
  
  }

  getSingleCampaignWithId(uid: any, campaign_id: any): Promise<any> {
    
   
    return new Promise(resolve => {
      this.afs.collection('notes', (ref) => ref.where('owner', '==', uid).where('id_campagne', '==', parseInt(`${campaign_id}`))).valueChanges().subscribe(data => {
        resolve(data[0])
      })
    
  
    })
  }

  getCampaignZones(campaign_id: string, name: string) {
    return new Promise(resolve => {
        setTimeout(() => {
       
          this.afs.collection('notes', (ref) => ref.where('name', '==', `${name}`).where('owner', '==', this.uid).where('id_campagne', '==', parseInt(`${campaign_id}`))).valueChanges().subscribe(el => {
            //console.log(el[0]['zones'])
          resolve(el[0]['zones'])
        })
      }, 2000);
    });
  }
  
  getCampaignDates(campaign_id: string, name: string){
      return new Promise(resolve => {
        setTimeout(() => {
       
          this.afs.collection('notes', (ref) => ref.where('name', '==', `${name}`).where('owner', '==', this.uid).where('id_campagne', '==', parseInt(`${campaign_id}`))).valueChanges().subscribe(el => {
            //console.log(el)
          resolve(el[0])
        })
      }, 2000);
    });
  }

  
  updateStartDate(id: string, campaign_id: string, startDate: string, startDateFrench: string): Promise<any> {
    return new Promise(resolve => {
      this.http.post(SERVER_URL+'/upDateCampaignStartDate', {
        'campaign_id': campaign_id,
        'startDate': startDate
      })
        .subscribe(
          res => {
            //console.log(res)
         
         
            this.updateNote(id, { startDate: res[0]['startDate'], startDateFrench: startDateFrench, servingStatus: res[0]['servingStatus'] }).then(res => {
              resolve('ok')
              /*  Swal.fire({
                 title: 'Modification date de début',
                 text: 'Date de début modifiée',
                 type: 'success',
                 showCancelButton: false,
                 confirmButtonColor: '#3085d6',
                 cancelButtonColor: '#d33',
                 confirmButtonText: 'Ok'
               }).then((result) => {
                 if (result.value) {}
               }) */
            })
          
          },
          err => {
            Swal.fire({
              title: 'Modification date de début',
              text: this.text_error_date,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) { }
            })
            resolve('error')
          }
        )
    })
  }
  
    updateEndDate(id: string, campaign_id: string, endDate: string, endDateFrench: string): Promise<any> {
       return  new Promise(resolve=>{
         this.http.post(SERVER_URL+'/upDateCampaignEndDate', {
       'campaign_id': campaign_id,
       'endDate': endDate
    })
      .subscribe(
        res => {
          //console.log(res)
         
         
          this.updateNote(id, { endDate: res[0]['endDate'], endDateFrench: endDateFrench, servingStatus: res[0]['servingStatus'] }).then(res => {
          resolve('ok')
           /*  Swal.fire({
              title: 'Modification date de fin',
              text: 'Date de fin modifiée',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) {}
            }) */
         })
          
        },
        err => {
          Swal.fire({
          title: 'Modification date de fin',
          text: this.error_end_date,
          type: 'error',
          showCancelButton: false,
             buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.value){}
        })
          resolve('error')
        }
      );
       })
  }

  updateDates(id: string, campaign_id: string, startDate: string, startDateFrench: string, endDate: string, endDateFrench: string): Promise<any> {
    return new Promise(resolve => {
      
      this.http.post(SERVER_URL+'/upDateCampaignDates', {
        'campaign_id': campaign_id,
        'startDate': startDate,
         'endDate': endDate
      })
        .subscribe(
          res => {
            //console.log(res)
           
           
            this.updateNote(id, { endDate: res[0]['endDate'], endDateFrench: endDateFrench, startDate: res[0]['startDate'], startDateFrench: startDateFrench, servingStatus: res[0]['servingStatus'] }).then(res => {
              if (res == "ok") {
                
                resolve('ok')
              }
           })
            
          },
          err => {
          resolve('error')
          }
        );
    })
    
  }


  getCampaignRealTimeData(id, campaign_id: string) {
          return      this.http.post(SERVER_URL+'/getCampaignData', {
       'campaign_id': campaign_id,
    
    })
      .subscribe(
        res => {
          
        /* //console.log(res[0]['name']) */
          //console.log(res[0]['servingStatus'])
          this.getSingleCampaign(campaign_id, res[0]['name']).subscribe(data => {
            if (data[0]['servingStatus'] != res[0]['servingStatus']) {
              if (res[0]['servingStatus'] == null) {
                this.updateNote(id, {servingStatus:  'None'})
                
              } else {
                 this.updateNote(id, {servingStatus: res[0]['servingStatus']})
              }
            }
              
              
            
          })
        
          
         
        
          
        },
        err => {
        
        }
      );
  }

  
parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[1], mdy[0]);
}

 datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
 }

  prepareSaveCampaign(id: any, name: string, status: string, startDate: string, endDate: string, startDateFrench: string, endDateFrench: string, servingStatus: string, budgetId: any): Note {
    
    const userDoc = this.afs.doc(`users/${this.uid}`);
      const newCampaign = {
      id_campagne: id,
      name: name,
        status: status,
      startDate: startDate,
        endDate: endDate,
        startDateFrench: startDateFrench,
        endDateFrench: endDateFrench,
        originalStartDate: new Date().valueOf(),
        originalEndDate: new Date().valueOf(),
        servingStatus: servingStatus,
        budget: 0, 
        dailyBudget: 0,
        numberOfDays: this.datediff(this.parseDate(startDateFrench), this.parseDate(endDateFrench)),
      budgetId: budgetId,
        zones: [],
       ages: [],
      sexes: [],
      devices: [],
        placement: [],
       criterion_ages: [],
    criterion_sexes: [],
    criterion_devices: [],
        criterion_placement: [],
        impressions: 0,
        clicks: 0,
        costs: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userDoc.ref,
      owner: this.uid,  
    };
    return {...newCampaign};
  }

  getData(): Observable<any[]> {
    // ['added', 'modified', 'removed']
    return this.notesCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }







  getNote(id: string) {
    return this.afs.doc<any>(`notes/${id}`);
  }

  async createTarget(id: string, data: any) {
      return this.getNote(id).update(data);
  }

  async createCampaign(id_campagne: any, name: string, status: string, startDate: string,endDate: string, startDateFrench: string, endDateFrench: string, servingSatus: string, budgetId: any): Promise<any> {
    return await new Promise(resolve => {
      this.note = this.prepareSaveCampaign(id_campagne, name, status, startDate, endDate, startDateFrench, endDateFrench, servingSatus, budgetId);
      const docRef = this.notesCollection.add(this.note);
      resolve("ok")
      
    })
  }

  updateNote(id: string, data: any): Promise<any> {
    return new Promise(resolve => {

      this.getNote(id).update(data).then(res => {

        resolve("ok")
      })
    })
  }

  /* deleteNote(id: string, ad_groups_list_id: any, ads_list_id: any) {
    //console.log(ad_groups_list_id.length)
    //console.log(ads_list_id.length)

    //console.log(ad_groups_list_id)
    //console.log(ads_list_id)
    if (ad_groups_list_id.length == 0) {
      //console.log("pas de groupe , pas d'annonce")
          return this.getNote(id).delete()

    } else if (ad_groups_list_id.length == 1) {
              //console.log("un groupe d'annonce")
      if (ads_list_id.length == 0) {
        //console.log("groupe d'annonce n'a aucune annonce")
        this.deleteAdGroupList(ad_groups_list_id).then(res => {
          if(res=="ok"){
            return this.getNote(id).delete()

          }
        })
      } else {
         //console.log(`ads list len ${ads_list_id.length}`)
        //console.log("groupe d'annonce a plusieurs annonces")
         this.deleteAdList(ads_list_id).then(res => {
          this.deleteAdGroupList(ad_groups_list_id).then(res => {
          return this.getNote(id).delete()
         
          })
        })
      }
    
      
     
    } else if (ad_groups_list_id.length > 1) {
      //console.log('plusieurs groupes')
      if (ads_list_id.length == 0) {
         this.deleteAdGroupList(ad_groups_list_id).then(res => {
          return this.getNote(id).delete()
         
          })
      } else {
        
        this.deleteAdList(ads_list_id).then(res => {
             this.deleteAdGroupList(ad_groups_list_id).then(res => {
             return this.getNote(id).delete()
            
             })
           })
      }
    } 
  } */
  deleteNote(id: string): Promise<any> {
    return new Promise((resolve) => {
      this.getNote(id).delete()
      resolve('ok')
    }
   
    )
    //console.log(ad_groups_list_id.length)
    //console.log(ads_list_id.length)

    //console.log(ad_groups_list_id)
    //console.log(ads_list_id)
    
  }

  deleteAdList(ads_list_id: any): Promise<any> {
    return new Promise(resolve => {
      if (ads_list_id.length == 1) {
          
        this.adsService.deleteAd(ads_list_id[0]).then(res => {
          
          resolve('ok')
        })
        
          
        }else {
         let i = 0
         //console.log('groupe')
         //console.log(ads_list_id)
         for (let i = 0; i < ads_list_id.length; i++){
             //console.log('removing')
            this.adsService.deleteAd(ads_list_id[i]).then(res => {
          
          resolve('ok')
        })
         }
       
      }
      
    })
  }
   deleteAdGroupList(ad_groups_list_id: any): Promise<any> {
     return new Promise(resolve => {
       if (ad_groups_list_id.length == 1) {
         this.adGroupService.deleteAdGroup(ad_groups_list_id[0]).then(res => {
           
             
           resolve('ok')
         })
          
        }else {
         let i = 0
         //console.log('groupe')
         //console.log(ad_groups_list_id)
         for (let i = 0; i < ad_groups_list_id.length; i++){
             //console.log('removing')
            this.adGroupService.deleteAdGroup(ad_groups_list_id[i]).then(res => {
              resolve('ok')
           
            })
         }
       
      }
       
      
    })
  }
  
}
