// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
    /* firebase: {
      apiKey: "AIzaSyC_cYQskL_dKhkt-aQ1ayHt8ia2NQYEHTs",
      authDomain: "comparez.firebaseapp.com",
      databaseURL: "https://comparez.firebaseio.com",
      projectId: "comparez",
      storageBucket: "gs://comparez.appspot.com/",
      messagingSenderId: "975260713071",
    },
    googleMapsKey: 'AIzaSyCTDRoGnPwEHP_Iw1Vc68GLrmNQ7iwBkhA' */
};

export const SERVER = {
  url: "http://127.0.0.1:5000",
  //url: "https://adafri.comparez.co",
  //url_redirect: "/dist/#",
  url_redirect: "/#",
  confidentialite: "http://localhost:4200/#/confidentialite",
  chrome: "localhost:4200",
  opera: "localhost:4200",
  safari1: "localhost:4200",
  safari2: "localhost:4200",
   protocol: "http://"

}


export const FIREBASE_CREDENTIALS  = {
    apiKey: "AIzaSyCpC7FjiILozY9z5990DcnIw7IoJdA8E2g",
    authDomain: "adafri-e5ceb.firebaseapp.com",
    databaseURL: "https://adafri-e5ceb.firebaseio.com",
    projectId: "adafri-e5ceb",
    storageBucket: "gs://adafri-e5ceb.appspot.com/",
    messagingSenderId: "702910555148",
    appId: "1:702910555148:web:0e2506edd3602e5f"
  };
