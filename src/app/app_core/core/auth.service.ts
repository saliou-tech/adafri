import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
// import * as $ from 'jquery'

import { firebase } from '@firebase/app';

import{ SERVER } from '../../../environments/environment.prod';

import { Observable, of, from } from 'rxjs';

import { auth } from 'firebase';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';

import { NotifyService } from './notify.service';

import { map } from 'rxjs/operators'

import Swal from 'sweetalert2'
import { MatDialog } from '@angular/material';
import { UserManagementComponent } from '../ui/user-management/user-management.component';
import { InscriptionConfirmComponent } from '../ui/inscription-confirm/inscription-confirm.component';


interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  account_value?: number;
  paymentKey?: string;
  // emailVerified?:boolean;
  isConnectWithMailAndPassword?:boolean;
}

interface NotificationAccountValue {
  uid: string;
  notification?: any;
}

@Injectable()
export class AuthService {
  user: Observable<User | null>;
  notificationAccount: Observable<NotificationAccountValue | null>
  // isEmalValid;
  islogged;
  changeusername;
  changepassword;
   

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notify: NotifyService,
    public ngZone: NgZone ,
    public dialog: MatDialog
    

  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
      // tap(user => localStorage.setItem('user', JSON.stringify(user))),
      // startWith(JSON.parse(localStorage.getItem('user')))
    );

   

     this.notificationAccount = this.afAuth.authState.pipe(
      switchMap(amount => {
        if (amount) {
          return this.afs.doc<NotificationAccountValue>(`notifications_account_value/${amount.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
      // tap(user => localStorage.setItem('user', JSON.stringify(user))),
      // startWith(JSON.parse(localStorage.getItem('user')))
    );
  }
// dalog
// showDialog(){
//   const dialogRef = this.dialog.open(InscriptionMailConfirmationComponent, {
//     width: '450px',
//     height: '200px'
//   }); 
//   setTimeout(() => {
//     dialogRef.close();
//   }, 100000);
// }
// end dialog
  ////// OAuth Methods /////

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  githubLogin() {
    const provider = new auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any): Promise<any> {
    return new Promise(resolve => {
    
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        console.log(credential)
        this.updateUserData(credential.user, credential.user.displayName,false).then(res => {
          if (res == "ok") {
            resolve('ok')
          } else {
            resolve('error')
          }
        });
      })
      .catch(error => this.handleError(error));
    })
  }

  //// Anonymous Auth ////

 /*  anonymousLogin() {
    return this.afAuth.auth
      .signInAnonymously()
      .then(credential => {
        this.notify.update('Welcome to Firestarter!!!', 'success');
        return this.updateUserData(credential.user); // if using firestore
      })
      .catch(error => {
        this.handleError(error);
      });
  } */

  //// Email/Password Auth ////

  // verification fonction
  // Send email verfificaiton when new user sign up


 

// Cette permet d'envoyer un mail de verification une fois que l'utilisateur s'est inscris

  SendVerificationMail(): Promise<any> {
  //  url: SERVER.url_redirect :c'est l'url continue ,il permet de redriger l'utilisateur sur le site une fois qu'il a valide son compte
    return new  Promise(resolve => {
      this.afAuth.auth.currentUser.sendEmailVerification({ url: SERVER.url_redirect })
    .then(() => {
     resolve('ok')
    })
    })
   
  }
  // method pour la reinitialisation du mot de passe d'un utilisateur 
   /** 
   
   * @param email la methode prends en parametre l'email de l'utilisateur
   *@param url c'est l'url continue ,il permet de redriger lutilisateur sue le site
   */ 
  resetPasswordInit(email: string) { 
    return this.afAuth.auth.sendPasswordResetEmail(
      email, 
      { url: SERVER.url_redirect }); 
    } 
   


  emailSignUp(username: string, email: string, password: string): Promise<any> {
    var self = this
    return new Promise(resolve => {
      this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        console.log(credential)
        //envoi une notification de verification de mail quand un user est cree
        this.SendVerificationMail().then(verify =>{
          if(verify=="ok"){
            self.updateUserData(credential.user, username,true).then(res => {
              if (res == "ok"  ) {
                // $('#exampleModalCenter').modal('show');
                this.showDialog()
                resolve("ok")
              } else {
                resolve("error")
              }
          })
        }
        })
       
      })
      .catch(error => this.handleError(error));
   })
  }

  getUserCredential(email:string):Promise<any>{
    return new Promise(resolve=>{
      this.afs.collection('users',(ref)=>ref.where('email','==',email)).valueChanges().forEach(data=>{
        resolve(data[0])
      })

    }) 

  }
 
  showDialog():void{
    let dialog = this.dialog.open(InscriptionConfirmComponent ,{
      width: '300px',
      // data: { name: this.name, animal: this.animal }
    });

    dialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.signOut()
    });
  }


  emailLogin(email: string, password: string):Promise<User[]> {
    var response = []
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        console.log(credential.user.emailVerified)
        // on verifie si l'utilisateur a verifie son mail
        if (credential.user.emailVerified !== true) {
         /**  si il ne l'a pas verifie on lui dit de le faire et le deconnecter ,
          * lamethode showdialog contient une fonction 
          qui permet de deconnecter l'utilisateur*/
        this.showDialog()  
        } else {
        Swal.fire({
        title: 'De retour '+ email,
        text: 'Bienvenue',
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.value) {

             
          response.push(credential.user)
          
        } else {
             
          response.push(credential.user)
          
        }

      })
        }
        
      }).catch(error => { this.handleError(error); });
      return Promise.resolve(response)
     
  } 



   afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    
    return this.router.navigate(['/']);
  }
  // Sends email allowing user to reset password
  // resetPassword(email: string) {
  //   const fbAuth = auth();

  //   return fbAuth
  //     .sendPasswordResetEmail(email)
  //     .then(() => this.notify.update('Password update email sent', 'info'))
  //     .catch(error => this.handleError(error));
  // }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      window.location.reload()
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    var error_to_show = ""
    if (error.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
      error_to_show = "Cet utilisateur n'éxiste pas"
    } else if (error.message == "The password is invalid or the user does not have a password.") {
      error_to_show = "Mot de passe ou addresse email invalide"
    } else if (error.message == "The email address is badly formatted.") {
      error_to_show = "Addresse Email invalide"
    } else if (error.message == "Password should be at least 6 characters") {
      error_to_show = "Le mot de passe doit contenir au moins 6 caractères"
    } else if (error.message == "The email address is already in use by another account.") {
      error_to_show = "Adresse email déjà utilisée"
    } else {
      error_to_show = "Une erreur s'est produite"
    }
     Swal.fire({
        title: 'Authentification',
        text: error_to_show,
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Rééssayer'
      }).then((result) => {
        if (result.value) {}

      })
  }

  // Sets user data to firestore after succesful login
  public updateUserData(user: User, username,connectionType:boolean): Promise<any> {
    return new Promise(resolve => {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}` 
    );
    const notificationRef: AngularFirestoreDocument<User> = this.afs.doc(
      `notifications_account_value/${user.uid}`
    );
    const data_notification: NotificationAccountValue = {
      uid: user.uid,
      notification: "Veuillez définir vos paramètres de facturation en cliquant ici"
    };
    notificationRef.set(data_notification)
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || username,
      photoURL: user.photoURL || 'assets/img/images/user.png',
      account_value: 0,
      paymentKey: "",
      isConnectWithMailAndPassword:connectionType
      // emailVerified: user.emailVerified
    };
      userRef.set(data);
      resolve("ok")
   })
  }

  getNotificationData(user_id: any) {
        return  this.afs.collection('notifications_account_value', (ref) => ref.where('uid', '==', `${user_id}`)).snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }



   
getUser(id: string) {
    return this.afs.doc<any>(`users/${id}`);
  }

   updateUser(id: string, data: any) :Promise<any>{
     return new Promise(resolve => {
       this.getUser(id).update(data).then((onFull) => {
         resolve('ok')
         
       }).catch(err => {
         resolve('error')
       })
    })
  }

  getNotification(id: string) {
    return this.afs.doc<any>(`notifications_account_value/${id}`);
  }

   updateNotification(id: string, data: any) {
    return this.getNotification(id).update(data);
  }
  public updateValueAccount(uid: any, email, account_value: any):Promise<any> {
    return new Promise(resolve => {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}` 
    );
    const data: User = {
     uid: uid,
      account_value: account_value,
      email: email,
      
    };
    const notificationRef: AngularFirestoreDocument<User> = this.afs.doc(
      `notifications_account_value/${uid}`
      );
      const data_notification: NotificationAccountValue = {
        uid: uid,
        notification: ""
      };
      userRef.set(data).then(() => {
        notificationRef.set(data_notification).then(() => {
          resolve("ok")
        })
        
      })
    })
  
  }
}
