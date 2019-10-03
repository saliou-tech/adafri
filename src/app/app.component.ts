import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NetworkStatusService } from 'ng-network-status';

import { DeviceDetectorService } from 'ngx-device-detector';

import { AuthService } from './app_core/core/auth.service';

import * as $ from 'jquery'
declare var require: any;
declare const particlesJS: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ NetworkStatusService ]
})
export class AppComponent implements OnInit {
  public deviceInfo = null;
  
  networkStatus = "Online";
  constructor(sanitizer: DomSanitizer, private auth: AuthService, private deviceService: DeviceDetectorService, private networkStatusService: NetworkStatusService) {
     
    this.detectDevice(); 
   
    
  }
   public detectDevice() {
     this.deviceInfo = this.deviceService.getDeviceInfo();

  }

  ngOnInit() {
  
    // Register health check
  
  }
   async loadScript(src){
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = src;
    $("body").css("background-image", "url('')")
  }

}
