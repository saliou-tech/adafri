import { inject } from "@angular/core/testing";
import { Injectable } from "@angular/core";

export const environment = {
  production: true
};

export const SERVER = {
  //url: "http://127.0.0.1:5000",

  url: "https://adafri.comparez.co",
  url_redirect: "https://adafri.com/#",
  confidentialite: "https://adafri.comparez.co/#/confidentialite",
  chrome: "adafri.com",
  opera: "www.adafri.com",
  safari1: "www.adafri.com",
  safari2: "adafri.com",
  protocol: "https://"

}


export const FIREBASE_CREDENTIALS = {
    apiKey: "AIzaSyCpC7FjiILozY9z5990DcnIw7IoJdA8E2g",
    authDomain: "adafri-e5ceb.firebaseapp.com",
    databaseURL: "https://adafri-e5ceb.firebaseio.com",
    projectId: "adafri-e5ceb",
    storageBucket: "gs://adafri-e5ceb.appspot.com/",
    messagingSenderId: "702910555148",
    appId: "1:702910555148:web:0e2506edd3602e5f"
  };