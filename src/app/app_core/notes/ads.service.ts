import { Injectable, OnInit, Self,  AfterViewInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import * as firebase from 'firebase/app';

import { AuthService } from '../../app_core/core/auth.service';

import { Annonces } from './annonces.models';
import Swal from 'sweetalert2'
import * as $ from 'jquery'

import { map } from 'rxjs/operators'
import * as moment from 'moment'
/* import { NoteDetailComponent } from './note-detail/note-detail.component' */

import {SERVER} from '../../../environments/environment'

declare var require: any;
var _ = require('lodash');

const SERVER_URL = SERVER.url
@Injectable()
export class Ads {
  currentUser: any;
  uid: any;
  isLoading: boolean;
  annonce_model: Annonces;
  today: Date = new Date();
  item: any;
  campaign_id:string;
private basePath = '/uploads';
  private annonceCollection:
    AngularFirestoreCollection<Annonces>;
   
 

  constructor(private afs: AngularFirestore, private auth: AuthService, private http: HttpClient) {
    this.auth.user.subscribe(data => {
     this.uid = data.uid
   })
  }


 /* pushFileToStorage(annonces: Annonces, progress: { percentage: number }) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${annonces.ad_name}`).put(annonces.url_ad);
 
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (error) => {
        // fail
        //console.log(error);
      },
      () => {
        // success
        annonces.url_ad = uploadTask.snapshot.downloadURL;
       
        this.saveFileData(annonces);
      }
    );
  } */
 
 

  
 getListAnnonces(ad_group_id: string) {
   //console.log(parseInt(ad_group_id))
   
   
 return this.afs.collection('adgroup', (ref) => ref.where('campaign_id','==',parseInt(`${ad_group_id}`))).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

    
  
  }
  

  annonceVerification(ad_name: string,  ad_group_id: string) {
    
     return new Promise(resolve => {
      setTimeout(() => {
        this.afs.collection('ads', (ref) => ref.where('ad_group_id', '==', parseInt(`${ad_group_id}`)).where('ad_name', '==', `${ad_name}`)).snapshotChanges().subscribe(data => {
          //console.log(`data ${data}`)
          this.item = data
          resolve(data.length)
      })
      }, 2000);
    });
  }

  getListAd(ad_group_id: string) {
   //console.log(parseInt(ad_group_id))
   var id = parseInt(ad_group_id)
   
 return this.afs.collection('ads', (ref) => ref.where('ad_group_id','==',`${id}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );

    
  
  }

   getSingleAd(ad_group_id: string, ad_id: number): Promise<any> {
  
  
   
     return new Promise(resolve => {
    this.afs.collection('ads', (ref) => ref.where('ad_group_id','==',`${ad_group_id}`).where('ad_id','==',parseInt(`${ad_id}`))).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    ).subscribe(res => {
      resolve(res[0])
    });

 })
    
  
  }

  
  
  async addAd(ad_id: any, ad_group_id: any, ad_name: any, image_url: any, finalUrls: any, finalAppUrls: any, finalMobileUrls: any, size: any): Promise<any> {
   
  
  
    return await new Promise(resolve => {
     /*  alert(size[0]['width'].toString()) */
      this.annonceVerification(ad_name, ad_group_id).then(value => {
      //console.log(`promise result: ${value}`)
      
      if (`${value}` == '0') {
        
        this.http.post(SERVER_URL+'/addAd', {
       'ad_group_id': ad_group_id,
          'url_image': image_url,
          'ad_name': ad_name,
          'finalUrls': finalUrls,
          'finalAppUrls': finalAppUrls,
          'finalMobileUrls': finalMobileUrls,
          'width': size[0]['width'].toString(),
          'height': size[0]['height'].toString(),
          "size": size
          
          
    })
      .subscribe(
        res => {
          var response = res['ad'][0]
         
         this.updateAd(ad_id, {ad_id:response['ad_id'], ad_group_id:  ad_group_id , ad_name: response['name'], status: response['status'], url_image: response['url_image'], displayUrl: response['displayUrl'], finalUrls:  response['finalUrls'],finalMobileUrls:response['finalMobileUrls'], finalAppUrls: response['finalAppUrls'], automated: response['automated'], referenceId: response['referenceId'] }).then(res=>{
            Swal.fire({
              title: 'Ajouter une annonce',
              text: 'Visuel publié avec succès',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) {
                resolve('ok')
              } else {
                resolve('ok')
              }
            })
         }) 
          
        },
        err => {
          Swal.fire({
          title: 'Ajouter une annonce',
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
          title: 'Ajouter une nouvelle annonce',
          text: "Il éxiste déjà une annonce portant une des données renseignées !",
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



   async saveAdOnFirebase(ad_group_id: any, ad_name: any, uid: any, url_image: any, image_content: any, allUrls: any, size: any, ad_type: any): Promise<any> {
    
  
     return new Promise(resolve => {
        var displayUrl = []
     var finalUrls = []
     var finalMobileUrls = []
     var finalAppUrls = []

     //console.log(allUrls)
     for (let i = 0; i < allUrls.length; i++){
       if (allUrls[i]['lib'] == 'finalUrls') {
         displayUrl.push(allUrls[i]['content'])
         
       }
      /*  if (allUrls[i]['lib'] == 'Application Mobiles') {
         finalAppUrls.push(allUrls[i]['content'])
         
       } */
     }
  
       this.annonceVerification(ad_name, ad_group_id).then(value => {
      //console.log(`promise result: ${value}`)
      var self = this
      if (`${value}` == '0') {
          
        
            this.createAd('', ad_group_id, ad_name, '', url_image,image_content, displayUrl[0], displayUrl[0], finalMobileUrls, finalAppUrls, '', '' , uid, size, ad_type).then(res=>{
              if (res == "ok") {
           
                resolve("ok")
              }
         }) 

      } else{
        Swal.fire({
          title: 'Ajouter une nouvelle annonce',
          text: "Il éxiste déjà une annonce portant une des données renseignées !",
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

  UpdateAdModified(id_ad_firebase: any, ad_id: any, ad_group_id: any, data: any): Promise<any> {
    return new Promise(resolve => {
       this.http.post(SERVER_URL+'/UpdateAd', {
          'ad_group_id': ad_group_id,
         'ad_id': ad_id,
          'data': data

          })

          .subscribe(
            res => {
              //console.log(res)
              if (res[0]['status'] == "ok") {
                for (let i = 0; i < data.toString().length; i++){
                  //console.log(data[i])
                  var field = data[i].fieldFirebase
                  var content = data[i].content
                 this.updateAd(id_ad_firebase, {field : content})
                }
                resolve('ok')
                
                
              }
            },
            err => {
              
              Swal.fire({
                title: "Service Annonce!",
                text: 'Erreur.',
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  
                }
              })
            }
          );
    })
  }

  prepareSaveAd(ad_id: any,ad_group_id: any, ad_name: any, status: any,  url_image: any, image_content: any, displayUrl: any, finalUrls: any, finalMobileUrls: any, finalAppUrls: any, referenceId: any, automated: any, uid: any, size: any, ad_type: any): Annonces {
    const userDoc = this.afs.doc(`users/${uid}`);
    const newAd = {
      ad_id: ad_id,
      ad_name: ad_name,
      ad_group_id: ad_group_id,
      status: status,
      url_image: url_image,
      image_content: image_content,
      displayUrl: displayUrl,
      finalUrls: finalUrls,
      finalMobileUrls: finalMobileUrls,
      finalAppUrls: finalAppUrls,
      referenceId: referenceId,
      automated: automated,
      combinedApprovalStatus: "",
      policy: "",
      size: size,
      ad_type: ad_type,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: userDoc.ref,
      owner: uid,  
    };
    return {...newAd};
  }

  getData(): Observable<any[]> {
    // ['added', 'modified', 'removed']
    
    return this.annonceCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }







  getAd(id: string) {
    return this.afs.doc<any>(`ads/${id}`);
  }



  async createAd(ad_id: any, ad_group_id: any, ad_name: any, status: any, url_image: any, image_content: any, displayUrl: any, finalUrls: any, finalMobileUrls: any, finalAppUrls: any, referenceId: any, automated: any, uid: any, size: any, ad_type: any):Promise<any> {
    return new Promise(resolve => {
      this.annonce_model = this.prepareSaveAd(ad_id, ad_group_id, ad_name, status, url_image, image_content, displayUrl, finalUrls, finalMobileUrls, finalAppUrls, referenceId,  automated, uid, size, ad_type);
      const docRef = this.afs.collection('ads').add(this.annonce_model);
      resolve('ok')
    })
  }


  /*  async createMultipleAd(ad_id: any, ad_group_id: any, ad_name: any, status: any, url_image: any, image_content: any, displayUrl: any, finalUrls: any, finalMobileUrls: any, finalAppUrls: any, referenceId: any, automated: any, uid: any, size: any, ad_type: any):Promise<any> {
     return new Promise(resolve => {
      let batch = this.afs.firestore.batch();
      this.annonce_model = this.prepareSaveAd(ad_id, ad_group_id, ad_name, status, url_image, image_content, displayUrl, finalUrls, finalMobileUrls, finalAppUrls, referenceId,  automated, uid, size, ad_type);
       let docRef = this.afs.collection('ads')
       batch.set(docRef., this.annonce_model)
      resolve('ok')
    })
  } */

  updateAd(id: string, data: any):Promise<any> {
    return new Promise(resolve => {
      this.getAd(id).update(data)
      resolve("ok")
    })
  }


  multipleUpdate(data: any) {
    for (var i = 0; i < data.length; i++){
    return  this.getAd(data[i]['ad_id']).update({combinedApprovalStatus: data[i]['combinedApprovalStatus'], policy: data[i]['policy']})
    }
  }

  deleteAd(id: string): Promise<any> {
    return new Promise(resolve => {
        this.getAd(id).delete().then(()=>{
        resolve('ok')
      })
    })
  }

  deleteAdPromise(id: string):Promise<any> {
    return new Promise(resolve => {
      this.getAd(id).delete().then(()=>{
        resolve('ok')
      })

    })
  }
  
}
