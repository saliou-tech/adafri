import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import {MatSidenav, MatDrawer} from '@angular/material/sidenav';
import {
  ActivatedRoute, Router
} from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SERVER } from '../../../../environments/environment'
import { ModulesList } from '../menu';


@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  @ViewChild('matDrawer') matDrawer: MatDrawer;
   @ViewChild('sidenav') sidenav: MatSidenav;
  photoURL = ""
  numberOfNotifications = 0
  notificationAccountValue = ""
  accountValue = 0
  username = ""
  email = ""
  uid = ""
  opened = true
   modulesList: Array<any>;
  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger;
  constructor(public auth: AuthService, private router: Router, private ren: Renderer2) {
    this.auth.user.forEach(data => {
      this.photoURL = data.photoURL
      this.accountValue = data.account_value
      this.username = data.displayName
      this.email = data.email
      this.uid = data.uid
    })
     this.modulesList = ModulesList;
   }
 menuenter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }

  menuLeave(trigger, button) {
    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80)
  }

  menu2enter() {
    this.isMatMenu2Open = true;
  }

  menu2Leave(trigger1, trigger2, button) {
    setTimeout(() => {
      if (this.isMatMenu2Open) {
        trigger1.closeMenu();
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        this.enteredButton = false;
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenu2Open = false;
        trigger2.closeMenu();
      }
    }, 100)
  }

  buttonEnter(trigger) {
    setTimeout(() => {
      this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        trigger.openMenu()
   }, 100)
  }

  buttonLeave(trigger, button) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
      }
    }, 100)
  }
  logout() {
    this.auth.signOut();
  }
  ngOnInit() {
    this.auth.notificationAccount.forEach((value) => {
      if(value.notification != ""){
        this.numberOfNotifications = 1
        this.notificationAccountValue = value.notification
      }
    })
  }
    goProfile() {
    this.router.navigate(['UserProfile'])
  }

  go() {
    window.location.replace(SERVER.url_redirect)

   /*  this.router.navigate(['/']) */
  }

}
