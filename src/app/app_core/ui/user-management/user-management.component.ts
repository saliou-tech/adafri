import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { FormBuilder, EmailValidator } from '@angular/forms';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { l } from '@angular/core/src/render3';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  getemail:{
    email:''
  };
  isemailNotvalid:boolean;
  getName:{
    name:'',
    email:''
  }
  isNameExist;
  userList = []
  user:User
  updateNameOk;
  isMailSend;

  constructor(private fb: FormBuilder,public auth: AuthService,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router, private afs: AngularFirestore, private afStorage: AngularFireStorage, private snackBar: MatSnackBar) { 
    this.afs.collection('users').valueChanges().forEach(data => {
       this.userList = data
     })
   
              }

  ngOnInit() {
    this.getemail={
      email:''
    }
    this.getName={
      name:'',
      email:''
    }
  }
  checkEmailValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       return re.test(email);
  }
  openDialogMailConfimation(): void {
    this.isMailSend = true
    this.data.changepassword = false
   
    let dialogRef = this.dialog.open(UserManagementComponent ,{
      width: '300px',
      
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.auth.signOut()
     
    });
  }
  resetPassword() { 
    if (!this.checkEmailValid(this.getemail.email)) {
      this.isemailNotvalid = true;
    }
    
    this.auth.resetPasswordInit(this.getemail.email) 
    .then(
      () => 
      this.openDialogMailConfimation(), 
      (rejectionReason) => alert(rejectionReason)) 
    .catch(e => alert('An error occurred while attempting to reset your password')); 
  }

  openDialogConfimation(): void {
   
    let dialogRef = this.dialog.open(UserManagementComponent ,{
      width: '300px',
      
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.auth.signOut()
     
    });
  }
 

  verifyIfNameExist(name:string): boolean{
    this.isNameExist = false
    
  this.userList.forEach(data => {

    if (data['displayName'] === name) {
      this.isNameExist = true
      console.log(this.isNameExist)
            
      } 

  })
  console.log(this.isNameExist) 
  return this.isNameExist

}
  resetName(){
    console.log(this.getName.name)
    this.isNameExist=this.verifyIfNameExist(this.getName.name);
    console.log("à la page 92",this.isNameExist)
    if(this.isNameExist){
      console.log("ce nom existe deja")
    }
    else{
      console.log(this.userList)
      console.log(this.getName.email)
      this.auth.getUserCredential(this.getName.email).then(response=>{
        this.user = response
       
        this.user.displayName = this.getName.name
        console.log(this.user)
        this.auth.updateUserData( this.user , this.user.displayName).then(res=> {
          if(res==='ok'){
            this.data.changeusername=false
            this.updateNameOk = true
            this.openDialogConfimation()
          }
        });
        
      
      });
    
      
        
      

    }

  }





}
