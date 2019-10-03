import {
  Component,
  OnInit,
  Input,
  AfterViewInit,ViewChild
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, MatSnackBar, NativeDateAdapter } from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats} from '@angular/material/core';

import {
  loadCldr,
  L10n
} from "@syncfusion/ej2-base";

import {
  database
} from 'firebase';

import * as FusionCharts from 'fusioncharts';

import {
  NotesService
} from '../../notes.service';
import {
  AuthService
} from '../../../core/auth.service';
import {SERVER} from '../../../../../environments/environment'
import Swal from 'sweetalert2'
import * as $ from 'jquery'
import { AdGroupService } from '../../ad-groupe.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router, ActivatedRoute } from '@angular/router'
import { Ads } from '../../ads.service'
import {
  AdGroup
} from '../../ad_group.models'
import * as CryptoJS from 'crypto-js'


/* const dataUrl =
  SERVER.url+"/campaignReport/"+; */
const schemaUrl =
  'https://raw.githubusercontent.com/fusioncharts/dev_centre_docs/fusiontime-beta-release/charts-resources/fusiontime/online-sales-single-series/schema.json';
declare var require: any;
declare const pQuery: any
declare const PayExpresse: any
declare const particlesJS: any; 
const MAX_BUDGET_VALUE = 10000001
const MIN_BUDGET_VALUE = 9999


export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      let year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return date.toDateString();
  }
}
export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};
export interface JSONDATE {
  selectedDate: string;
}


const SERVER_URL = SERVER.url
const MONTH = [{
  "Jan": {
    "name": "January",
    "short": "Jan",
    "number": '01',
    "days": '31'
  },
  "Feb": {
    "name": "February",
    "short": "Feb",
    "number": '2',
    "days": '28'
  },
  "Mar": {
    "name": "March",
    "short": "Mar",
    "number": '03',
    "days": '31'
  },
  "Apr": {
    "name": "April",
    "short": "Apr",
    "number": '04',
    "days": '30'
  },
  "May": {
    "name": "May",
    "short": "May",
    "number": '05',
    "days": '31'
  },
  "Jun": {
    "name": "June",
    "short": "Jun",
    "number": '06',
    "days": '30'
  },
  "Jul": {
    "name": "July",
    "short": "Jul",
    "number": '07',
    "days": '31'
  },
  "Aug": {
    "name": "August",
    "short": "Aug",
    "number": '08',
    "days": '31'
  },
  "Sep": {
    "name": "September",
    "short": "Sep",
    "number": '09',
    "days": '30'
  },
  "Oct": {
    "name": "October",
    "short": "Oct",
    "number": '10',
    "days": '31'
  },
  "Nov": {
    "name": "November",
    "short": "Nov",
    "number": '11',
    "days": '30'
  },
  "Dec": {
    "name": "December",
    "short": "Dec",
    "number": '12',
    "days": '31'
  }
}]

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
   providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide:  DateAdapter, useClass: AppDateAdapter, deps: [MAT_DATE_LOCALE]},
   {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ],
})
  
export class SettingsComponent {
   @ViewChild(MatPaginator) paginator: MatPaginator;
 dataL : any;
   displayedColumns = ['select', 'name', 'status', "Paramétrer"];
  dataSourceList = new MatTableDataSource<AdGroup>([])
  selection = new SelectionModel<AdGroup>(true, []);
loadProgress = false
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceList.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  console.log(this.selection.selected)
  console.log(this.dataSource.data)
   const numRows = this.dataSourceList.data.length 
  console.log(numSelected)
     return numSelected === numRows; 
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSourceList.data.forEach(row => this.selection.select(row));
  }
  private adGroupCollection: AngularFirestoreCollection<AdGroup>;
  campaignFinish = false 
  budgetTable = [];
  dataSource: any;
  type: string;
  width: string;
  height: string;
  id_campagne: string;
  id: string;
  name: string;
  status: string;
  ad_group_id: string;
  uid: string;
  budget: any;
  budgetId: any;
  dailyBudget: any;
  numberOfDays: any;
  impressions = 0
  clicks = 0
  cost = 0
  button_payments = true
  ad_group_tab_content =  [];
  email: string;
  ad_groups_list_id = []
  ads_list_id = []
  number_of_impressions = 0
  user: Observable < any > ;
  number_ad_groups: any;
  isCreating = false
  isAdGroup = false
  isCiblage = false
  startDate: any;
  endDate: any;
  ad_group_name: any;
  servingStatus: any;
  adgroups: Observable < any[] > ;
  labelDateStart = "Date de début";
  labelDateEnd = "Date de fin"
  labelServing = "Actuellemnt en diffusion"
  labelNotServing = "Non diffusée, changer la date de début pour commencer la diffusion"
  labelSuspended = "Suspendu"
  labelNone = "Pas assez de fonds displonible pour démarrer une campagne"
  labelEnded = "Campagne publicitaire terminée"
  text_status_deactive_campaign = "Désactivée"
  text_status_active_campaign = "Activée"
  text_no_zone = "Aucune zone ciblée"
  sn = 'Tout le Sénégal'
  dk = 'Dakar'
  generale='Général'
  zone: any;
error_recharge = ""
  ages = []
  sexes = [];
  zones = [];
  devices = []
  genres: any;
  populations: any;
  appareils: any;
  isCiblageGenre = false
  isCiblageAge = false
  isCiblageDevices = false
  isPlacement = false
  nationals_errors: any
 
 
  dure_campagne = 0
  
  
  budget_to_place = 0;
  my_gain = 0;
  number_of_impressions_simulated = 0
  montant = 0
  accountValue = 0
  modifyDate = false
  isSetBudget = false
  isAccountRechargement = false
  isPlacementBudgetFromAccount = false
  isRoller = false
  isSimulation = false
  newStartDate: any
  newEndDate: any;
  startDateFrench: any;
  endDateFrench: any;
  UpdatedStartDate: any;
  UpdatedEndDate: any
  today: any
   nationals_websites = []
  internationals_websites = []
  ads_websites = []
  currentAdStatus: any
  apps = []
  currentUser: any;
  numberOfNotifications = 0
  notificationAccountValue = ""
  photoURL = ""
  
   public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
   {data: [0], label: 'Clicks'},
    {data: [0], label: 'Coût'
    },
    { data: [0], label: 'Impressions' }
  ];

  displayedColumnsBudget = ['change', 'debut', 'fin', 'budget', 'action'];
  
  constructor(private notesService: NotesService, public auth: AuthService, private adGroupService: AdGroupService, private http: HttpClient, private afs: AngularFirestore, private router: Router, private adsService: Ads,  private route: ActivatedRoute, public snackBar: MatSnackBar) {
this.auth.user.forEach(data => {
  this.currentUser = data.displayName
  this.photoURL = data.photoURL
    })
    
    this.auth.notificationAccount.forEach((value) => {
      if(value.notification != ""){
        this.numberOfNotifications = 1
        this.notificationAccountValue = value.notification
      
      }
    })
     this.type = 'timeseries';
    this.width = '400';
    this.height = '400';
    this.dataSource = {
      data: null,
      yAxis: {
        plot: [{ value: 'Sales' }]
      },
      caption: {
        text: 'Online Sales of a SuperStore in the US'
      }
    };
 
  }
  dropdownListAges = [];
  dropdownListSexes = [];
  dropdownListZones = [];
  dropdownListDevices = [];
  dropdownListNationalsWebsites = [];
   dropdownListInternationalsWebsites = [];
  dropdownListAdsWebsites = [];
  dropdownListApps = [];
  selectedItems = [];
  selectedZones = [];
  dropdownSettingsAges = {};
  dropdownSettingsSexes = {};
  dropdownSettingsZones = {};
  dropdownSettingsDevices = {};
  dropdownSettingsNationalsWebsites = {};
  dropdownSettingsInternationalsWebsites = {};
  dropdownSettingsAdsWebsites = {};
  dropdownSettingsApps = {};
  
   NATIONALS_WEBSITES = [
  [1,"infos","dakarbuzz.net","http://dakarbuzz.net"  ],
  [2,"infos","galsen221.com","http://galsen221.com"  ],
  [3,"infos","leral.net","http://leral.net"  ],
  [4,"infos","limametti.com","http://limametti.com"  ],
  [5,"infos","sanslimitesn.com","http://sanslimitesn.com"  ],
  [6,"infos","senego.com","http://senego.com"  ],
  [7,"infos","seneweb.com","http://seneweb.com"  ],
  [8,"infos","www.buzzsenegal.com","http://www.buzzsenegal.com"  ],
  [9,"infos","www.dakar7.com","http://www.dakar7.com"  ],
  [10,"infos","www.dakarflash.com","http://www.dakarflash.com"  ],
  [11,"infos","www.lequotidien.sn","http://www.lequotidien.sn"  ],
  [12,"infos","www.pressafrik.com","http://www.pressafrik.com"  ],
  [13,"infos","www.senenews.com","http://www.senenews.com"  ],
  [14,"infos","xalimasn.com","http://xalimasn.com"  ],
  [15,"infos","metrodakar.net","http://metrodakar.net"  ],
  [16,"infos","sunubuzzsn.com","http://sunubuzzsn.com"  ],
  [17,"infos","senegal7.com","http://senegal7.com"  ],
  [18,"infos","senescoop.net","http://senescoop.net"  ],
  [19,"infos","sunugal24.net","http://sunugal24.net"  ],
  [20,"infos","dakar92.com","http://dakar92.com"  ],
  [21,"infos","rumeurs221.com","http://rumeurs221.com"  ],
  [22,"infos","bonjourdakar.com","http://bonjourdakar.com"  ],
  [23,"infos","vipeoples.net","http://vipeoples.net"  ],
  [24,"infos","seneplus.com","http://seneplus.com"  ],
  [25,"infos","wiwsport.com","http://wiwsport.com"  ],
  [26,"infos","viberadio.sn","http://viberadio.sn"  ],
  [27,"infos","yerimpost.com","http://yerimpost.com"  ],
  [28,"infos","ndarinfo.com","http://ndarinfo.com"  ],
  [29,"infos","dakarposte.com","http://dakarposte.com"  ],
  [30,"infos","exclusif.net","http://exclusif.net"  ],
  [31,"infos","senegaldirect.net","http://senegaldirect.net"  ]
  ]
  
  INTERNATIONALS_WEBSITES = [
  [1,"sport ","footmercato.net","http://www.footmercato.net"  ],
  [2,"infos","lexpress.fr","http://www.lexpress.fr"  ],
  [3,"sport ","mercatolive.fr","http://www.mercatolive.fr"  ],
  [4,"sport ","maxifoot.fr","http://maxifoot.fr"  ],
  [5,"sport ","livefoot.fr","http://livefoot.fr"  ],
  [6,"forum","01net.com","http://01net.com"  ],
  [7,"sport ","le10sport.com","http://le10sport.com"  ],
  [8,"sport ","maxifoot-live.com","http://maxifoot-live.com"  ],
  [9,"forum","01net.com","http://01net.com"  ],
  [10,"infos","bfmtv.com","http://bfmtv.com"  ],
  [11,"sport ","besoccer.com","http://besoccer.com"  ],
  [12,"sport ","foot01.com","http://foot01.com"  ],
  [13,"sport ","basketsession.com","http://basketsession.com"  ],
  [14,"sport ","basket-infos.com","http://basket-infos.com"  ],
  [15,"infos","skyrock.com","http://skyrock.com"  ],
  [16,"infos","leparisien.fr","http://leparisien.fr"  ],
  ]
  
  SITES_ANNONCES = [
     [1,"annonces","deals.jumia.sn","http://deals.jumia.sn"  ],
  [2,"annonces","expat-dakar.com","http://expat-dakar.com"  ],
  [3,"annonces","coinafrique.com","http://coinafrique.com"  ]
  ]

  APP_MOBILES = [
  [1,"App","Senego","https://play.google.com/store/apps/details?id=com.nextwebart.senego"  ],
  [2,"App","Super-Bright LED Flashlight ","https://play.google.com/store/apps/details?id=com.surpax.ledflashlight.panel"  ],
  [3,"App","CallApp: Caller ID","https://play.google.com/store/apps/details?id=com.callapp.contacts"  ],
  [4,"App","PhotoGrid: Video & Pic Collage Maker, ","https://play.google.com/store/apps/details?id=com.roidapp.photogrid"  ],
  [5,"App","Bubble Shooter ","https://play.google.com/store/apps/details?id=bubbleshooter.orig"  ],
  [6,"App"," MAX Cleaner - Antivirus, Phone Cleaner","https://play.google.com/store/apps/details?id=com.oneapp.max.cleaner.booster"  ],
  [7,"App","Block Puzzle ","https://play.google.com/store/apps/details?id=com.puzzlegamesclassic.tetris.blockpuzzle"  ],
  [8,"App","Bubble Breaker ","https://play.google.com/store/apps/details?id=com.faceplus.bubble.breaker"  ],
  [9,"App","Flashlight ","https://play.google.com/store/apps/details?id=com.splendapps.torch"  ],
  [10,"App","Photo Lock App ","https://play.google.com/store/apps/details?id=vault.gallery.lock"  ]
]

  fetchData() {
    var self =this
    let jsonify = res => res.json();
    let dataFetch = fetch(SERVER.url+"/campaignReport/"+self.id_campagne).then(jsonify);
    
    let schemaFetch = fetch(SERVER.url+"/getSchemaReportCampaign").then(jsonify);
    Promise.all([dataFetch, schemaFetch]).then(res => {
      let data = res[0];
      ////console.log(data)
      let schema = res[1];
      ////console.log(res[1])
       var tableData = [];
      $.each(data, function (key, value) {
        ////console.log(key, value)
        tableData.push(value);
      })
      ////console.log(tableData)
   
      ////console.log(parseInt(data['clicks']))
      ////console.log(parseInt(data['impressions']))
      ////console.log(parseInt(data['cost']))
      if (parseInt(data['clicks']) !== 0 && parseInt(data['impressions']) !== 0 && parseInt(data['cost']) !== 0) {
        self.notesService.updateNote(self.id, {clicks:parseInt(data['clicks']), impressions: parseInt(data['impressions']), cost: parseInt(data['coûts']) })
        
      }
    });
  }
  cryptMoney(money: string) {
    var CryptoJS = require( 'crypto-js' );

var secretMessage = money;
    var secretKey = this.uid
   

var encryptedMessage = CryptoJS.AES.encrypt(secretMessage, CryptoJS.enc.Hex.parse(secretKey),
                       { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding });

    ////console.log('encryptedMessage: ' + encryptedMessage.ciphertext);
    
  return encryptedMessage.ciphertext

  }

  go1() {
   window.location.replace(SERVER.url_redirect)
 }
getDateArray(start, end) {
    var arr = new Array();
  var dt = new Date(start);
  var _end = new Date(end)
  ////console.log(dt)
    while (dt <= _end) {
        arr.push(new Date(dt).getDate()+"/"+(new Date(dt).getMonth()+1)+"/"+new Date(dt).getFullYear())
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}



  
  getUser() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.auth.user.forEach(data => {
          this.email = data.email
          if (typeof (data.account_value) == typeof (0)) {
            this.accountValue = data.account_value
            
          } else {
            this.accountValue = data.account_value
          }
        
          resolve(data.uid)
        })
      }, 2000);
    });
  }

  getRoute(): Promise<any>{
    return new Promise(resolve => {
       this.route.params.subscribe(params => {
      this.name = params['name']
      this.id = params['id']
         this.id_campagne = params['id_campagne']
         resolve("ok")
    })
    })
  }

  verifyIfCampaignStart(startDateFrench): Promise<any>{
    return new Promise(resolve => {
          var tabStart = startDateFrench.split("/")
          var frenchDateStart = tabStart[2] + "-" + tabStart[1] + "-" + tabStart[0] 
          var today_date = new Date().getDate()
          var years = new Date().getFullYear()
          var month = new Date().getMonth() + 1
          new Date().valueOf()
          if (month < 10 && today_date < 10) {
            this.today =  years.toString() + "-0" + month.toString() + "-0" + today_date.toString()
          } else if (month < 10 && today_date > 10) {
            this.today = years.toString() + "-0" + month.toString() +"-"+ today_date.toString()
          } else if (month > 10 && today_date < 10) {
            this.today =  years.toString() + month.toString() + "-0" + today_date.toString()
          } else {
            this.today = years.toString() + "-"+ month.toString() +"-"+ today_date.toString()   
          }
          var now = new Date(this.today).setHours(0,0,0,0)
      var start = new Date(frenchDateStart).setHours(0, 0, 0, 0)
  
          if (now === start) {
            console.log('start today')
            resolve("ok")
          } else if (now > start) {
            console.log("running")
            resolve("ok")
          } else if(now < start) {
            console.log("not running")
            resolve("ok")
          }
    })
  }

    verifyIfCampaignEnd(endDateFrench): Promise<any>{
    return new Promise(resolve => {
          var tabEnd = endDateFrench.split("/") 
          var frenchDateEnd = tabEnd[2] + "-" + tabEnd[1] + "-" + tabEnd[0] 
          var today_date = new Date().getDate()
          var years = new Date().getFullYear()
          var month = new Date().getMonth() + 1
          new Date().valueOf()
          if (month < 10 && today_date < 10) {
            this.today =  years.toString() + "-0" + month.toString() + "-0" + today_date.toString()
          } else if (month < 10 && today_date > 10) {
            this.today = years.toString() + "-0" + month.toString() +"-"+ today_date.toString()
          } else if (month > 10 && today_date < 10) {
            this.today =  years.toString() + month.toString() + "-0" + today_date.toString()
          } else {
            this.today = years.toString() + "-"+ month.toString() +"-"+ today_date.toString()   
          }
          var now = new Date(this.today).setHours(0,0,0,0)
          var end = new Date(frenchDateEnd).setHours(0, 0, 0, 0)
          if (now === end) {
            console.log('end today')
            resolve("ok")
          } else if (now > end) {
            console.log("campaign ended")
            resolve("ok")
          } else if(now < end) {
            console.log("campaign not ended")
            resolve("ok")
          }
    })
  }
  ngOnInit() {

    /*        L10n.load({
          'fr': {
            'datepicker': {
              placeholder: 'Date de début',
              today:"Aujourd'hui"
            }
          }
        }) */
    ;
    this.getRoute().then(res => {
      if (res == "ok") {
              this.auth.user.forEach(data1 => {
      this.accountValue = data1.account_value
      this.uid = data1.uid
 
      
                this.notesService.getSingleCampaign(this.id_campagne, this.name).subscribe(res => {
       this.budgetTable = res
        res.forEach(data => {
          this.status = data['status']
          this.startDateFrench = data['startDateFrench']
         
        this.endDateFrench = data['endDateFrench'] 
         this.dure_campagne = this.datediff(this.parseDate(data['startDateFrench']), this.parseDate(data['endDateFrench'] ))
        this.servingStatus = data['servingStatus']
        var result = data['zones']
        this.zone = result
        this.appareils = data['devices']
        this.populations = data['ages']
        this.genres = data['sexes']
        this.clicks = data['clicks']
        this.impressions = data['impressions']
          this.cost = data['costs']
          this.budgetId = data['budgetId']
        this.budget = data['budget']
          this.dailyBudget = data['dailyBudget']
          this.numberOfDays = data['numberOfDays']
          /* this.budgetTable.push({
            "debut": data['startDateFrench'],
            "fin": data['endDateFrench'] ,
            "budget": data['budget']
          }) */
          this.verifyIfCampaignStart(this.startDateFrench)
          this.verifyIfCampaignEnd(this.endDateFrench)
          
          
        
        
        ////console.log(data['startDate'])
        var startDate = data['startDate'].slice(0,4)+"-"+ data['startDate'].slice(4,6)+"-"+ data['startDate'].slice(6,8)
        var endDate = data['endDate'].slice(0, 4) + "-" + data['endDate'].slice(4, 6) + "-" + data['endDate'].slice(6, 8)
        ////console.log(startDate)
        ////console.log(endDate)
        var dateArr = this.getDateArray(startDate, endDate);
        ////console.log(dateArr)
// Output
for (var i = 0; i < dateArr.length; i++) {
  this.barChartLabels.push(dateArr[i])
  ////console.log(this.barChartLabels)
}
    
      })
    }) 
    })

        this.adgroups = this.adGroupService.getListAdGroup(this.id_campagne)
        this.adgroups.subscribe(data => {
          this.dataSourceList = new MatTableDataSource(data)
          this.dataSourceList.paginator = this.paginator
        })
    this.adgroups.forEach(child => {
      ////console.log(child)
      if (child.length > 0) {
        this.number_ad_groups = child.length
      } else {
        this.number_ad_groups = "0"
      }

    })
       this.dropdownListZones = [{
      item_id: 9067846,
      item_text: this.dk
       },
         {
           item_id: 2686,
           item_text: this.sn
       }];
     this.dropdownSettingsZones = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      searchPlaceholderText: 'Rechercher',

     };
    

     this.dropdownListAges = [{
        item_id: 503999,
        item_text: 'indéterminé'
      },
      {
        item_id: 503001,
        item_text: '18-24 ans'
      },
      {
        item_id: 503002,
        item_text: '25-34 ans'
      },
      {
        item_id: 503003,
        item_text: '35-44 ans'
      },
      {
        item_id: 503004,
        item_text: '45-54 ans'
      },
      {
        item_id: 503005,
        item_text: '55-64 ans'
      },
      {
        item_id: 503006,
        item_text: '+64 ans'
      }
    ];
    this.dropdownListSexes = [{
        item_id: 20,
        item_text: 'indéterminé'
      },
      {
        item_id: 10,
        item_text: 'Hommes'
      },
      {
        item_id: 11,
        item_text: 'Femmes'
      },
    ];
    this.dropdownListDevices = [{
        item_id: 30000,
        item_text: 'Ordinateurs'
      },
      {
        item_id: 30001,
        item_text: 'Mobiles'
      },
      {
        item_id: 30002,
        item_text: 'Tablettes'
      },
      {
        item_id: 30004,
        item_text: "Tv Connectée"
      }
    ];
    this.dropdownListZones = [{
      item_id: 9070424,
      item_text: 'Dakar'
    },
    {
      item_id: 9070424,
      item_text: 'Sénégal'
    }
    ];
    for (let i = 0; i < this.NATIONALS_WEBSITES.length; i++){
      ////console.log(this.NATIONALS_WEBSITES[i][2])
      this.dropdownListNationalsWebsites.push({
         item_id: this.NATIONALS_WEBSITES[i][3],
         item_text: this.NATIONALS_WEBSITES[i][2]
       }
      );
    }

    for (let i = 0; i < this.INTERNATIONALS_WEBSITES.length; i++) {
      
      this.dropdownListInternationalsWebsites.push({
        item_id: this.INTERNATIONALS_WEBSITES[i][3],
        item_text: this.INTERNATIONALS_WEBSITES[i][2]
      
      }
      );
    }

    for (let i = 0; i < this.SITES_ANNONCES.length; i++){
      
      this.dropdownListAdsWebsites.push({
       item_id: this.SITES_ANNONCES[i][3],
       item_text: this.SITES_ANNONCES[i][2]
     }
      );
    }

    for (let i = 0; i < this.APP_MOBILES.length; i++){
      
      this.dropdownListApps.push({
        item_id: this.APP_MOBILES[i][3],
        item_text: this.APP_MOBILES[i][2]
      }
      );
    }
    this.dropdownSettingsAges = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Tout sélectionner',
      unSelectAllText: 'annuler',
      itemsShowLimit: 8,
      allowSearchFilter: false,
      searchPlaceholderText: 'Rechercher',

    };
    this.dropdownSettingsSexes = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'Rechercher',

    };
    this.dropdownSettingsZones = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'Rechercher',

    };
    this.dropdownSettingsDevices = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Tout sélectionner',
      unSelectAllText: 'annuler',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      searchPlaceholderText: 'Rechercher',

    };
     this.dropdownSettingsNationalsWebsites = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Tout sélectionner',
      unSelectAllText: 'annuler',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      searchPlaceholderText: 'Rechercher',

     };
       this.dropdownSettingsInternationalsWebsites = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Tout sélectionner',
      unSelectAllText: 'annuler',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      searchPlaceholderText: 'Rechercher',

       };
       this.dropdownSettingsAdsWebsites = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Tout sélectionner',
      unSelectAllText: 'annuler',
      itemsShowLimit: 10,
      allowSearchFilter: false,
      searchPlaceholderText: 'Rechercher',

       };
       this.dropdownSettingsApps = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Tout sélectionner',
      unSelectAllText: 'annuler',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      searchPlaceholderText: 'Rechercher',

       };
            

 
    
    this.fetchData();
   /*   var text = 'Some data I want to export';
var data = new Blob([text], {type: 'text/plain'});

var url = window.URL.createObjectURL(data);

document.getElementById('download_link').setAttribute('href', url)  */
          }
         
        })
   
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
  downloadFile() {
    this.isCreating = true
    let download = require('../../../../../assets/js/download.js');
    let file_name = this.id_campagne
    
    let url = `${SERVER.url}/uploads/${this.id_campagne}.csv`;
    fetch(SERVER.url + "/campaignReport/" + this.id_campagne).then(res => {
  
      if (res['status'].toString() == "200") {
        
         /* fetch(url, {
          method: 'OPTIONS',
          headers: {
            'Authorization': ''
          }
        }).then(function(resp) {
          return resp.blob();
        }).then(function(blob) {
          download(blob);
        }); */
        var self = this
        var xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.responseType = 'blob';
xhr.onload = function(e) {
  if (this.status == 200) {
    var myBlob = this.response;
    ////console.log(myBlob)
    download(myBlob, "Reporting", "text/csv")

    // myBlob is now the blob that the object URL pointed to.
  }
};
xhr.send();
      }
      this.isCreating = false
    });
}

  /*  this.adgroups = this.getData();
   
    
   })  */
  go() {
  window.location.replace(SERVER.url_redirect)
}
  openAddCiblageGenre() {
    this.isCiblageGenre = true;

  }
  openAddCiblageDevices() {
    this.isCiblageDevices = true;

  }
  targetGender() {
    ////console.log(this.sexes)
    this.isCreating = true
    if (this.sexes.length == 0) {
      this.isCreating = false
      Swal.fire({
        title: 'Ciblage',
        text: 'Aucun genre séléctionné',
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.value) {}

      })
    } else {
    /*   this.adGroupService.targetGenre(this.idA, this.campagne_id, this.ad_group_id, this.sexes).then(res => {
        this.sexes = []
      }).then(res => {
        this.isCiblageGenre = false
        this.isCreating = false
      }) */

    }
  }

  targetPlacement() {
    var self = this
    var placement = []
    ////console.log(this.ads_websites)
    ////console.log(this.nationals_websites)
    ////console.log(this.internationals_websites)
    this.isCreating = true
    if (this.nationals_websites.length == 0) {
      this.isCreating = false
      Swal.fire({
        title: 'Ciblage',
        text: 'Séléctionner au moins un site national',
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.value) {}

      })
    } else {
      placement.push(this.nationals_websites, this.internationals_websites, this.ads_websites)
      /* this.adGroupService.targetPlacement(this.idA, this.campagne_id, this.ad_group_id, placement).then(res => {
        this.sexes = []
      }).then(res => {
        this.isCiblageGenre = false
        this.isCreating = false
      }) */

    }
  }

 
  
  targetDevices() {
    ////console.log(this.devices)
    this.isCreating = true
    if (this.devices.length == 0) {
      this.isCreating = false
      Swal.fire({
        title: 'Ciblage',
        text: 'Aucun appareil séléctionné',
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.value) {}
      })
    } else {
     /*  this.adGroupService.targetDevices(this.idA, this.campagne_id, this.ad_group_id, this.devices).then(res => {
        this.devices = []
      }).then(res => {
        this.isCreating = false
        this.isCiblageDevices = false

      }) */

    }
  }

  closeAddCiblageGenre() {
    this.isCiblageGenre = false
  }
  closeAddCiblageDevices() {
    this.isCiblageDevices = false
  }
  closeAddPlacement() {
  this.isPlacement = false
}

  openAddCiblageAge() {
    this.isCiblageAge = true;

  }
  targetAge() {
    ////console.log(this.ages)
    this.isCreating = true
    if (this.ages.length == 0) {
      this.isCreating = false
      Swal.fire({
        title: 'Ciblage',
        text: 'Aucun genre séléctionné',
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.value) {}
      })
    } else {
       this.notesService.targetAge(this.id, this.id_campagne, this.ages, this.uid).then(res => {
        this.ages = []
      }).then(res => {
        this.isCiblageAge = false
        this.isCreating = false

      })

    }
  }

  closeAddCiblageAges() {
    this.isCiblageAge = false
  }

  onAgeSelect(item: any) {
    this.ages.push(item)
    ////console.log(this.ages)
  }
  onAgeSelectAll(items: any) {
    ////console.log(items);
    this.ages = []
    this.ages = items
  }
  onAgeDeSelect(item: any) {
    ////console.log(item)
    for (var i = 0; i < this.ages.length; i++) {
      if (this.ages[i]['item_id'] == item.item_id) {
        this.ages.splice(i, 1)
      }
    }
    ////console.log(this.ages)

  }
  onDeSelectAllAge() {
    this.ages = []
    ////console.log(this.ages)
  }


  onNationalsWebsitesSelect(item: any) {
    this.nationals_errors = ''
    this.nationals_websites.push(item)
    ////console.log(this.nationals_websites)
  }
  onNationalsWebsitesSelectAll(items: any) {
     this.nationals_errors = ''
    this.nationals_websites = []
    this.nationals_websites = items
    ////console.log(this.nationals_websites);
  }
  onNationalsWebsitesDeSelect(item: any) {
    ////console.log(item)
    for (var i = 0; i < this.nationals_websites.length; i++) {
      if (this.nationals_websites[i]['item_id'] == item.item_id) {
        this.nationals_websites.splice(i, 1)
      }
    }
    ////console.log(this.nationals_websites)

  }
  onNationalsWebsitesDeSelectAll() {
    this.nationals_websites = []
    ////console.log(this.nationals_websites)
  }


   onInternationalsWebsitesSelect(item: any) {
    this.internationals_websites.push(item)
    ////console.log(this.internationals_websites)
  }
  onInternationalsWebsitesSelectAll(items: any) {
    
    this.internationals_websites = []
    this.internationals_websites = items
    ////console.log(this.internationals_websites)
  }
  onInternationalsWebsitesDeSelect(item: any) {
    ////console.log(item)
    for (var i = 0; i < this.internationals_websites.length; i++) {
      if (this.internationals_websites[i]['item_id'] == item.item_id) {
        this.internationals_websites.splice(i, 1)
      }
    }


  }
  onInternationalsWebsitesDeSelectAll() {
    this.internationals_websites = []
   
  }

   onAdsWebsitesSelect(item: any) {
    this.ads_websites.push(item)
    ////console.log(this.ads_websites)
   }
  onAdsWebsitesSelectAll(items: any) {
    this.ads_websites = []
    this.ads_websites = items
    ////console.log(this.ads_websites);
    
  }
  onAdsWebsitesDeSelect(item: any) {
    ////console.log(item)
    for (var i = 0; i < this.ads_websites.length; i++) {
      if (this.ads_websites[i]['item_id'] == item.item_id) {
        this.ads_websites.splice(i, 1)
      }
    }
    ////console.log(this.ads_websites)

  }
  onAdsWebsitesDeSelectAll() {
    this.ads_websites = []
    ////console.log(this.ads_websites)
  }

   onAppsSelect(item: any) {
    this.apps.push(item)
    ////console.log(this.apps)
  }
  onAppsSelectAll(items: any) {
    this.apps = []
    this.apps = items
    ////console.log(this.apps);
  }
  onAppsDeSelect(item: any) {
    ////console.log(item)
    for (var i = 0; i < this.apps.length; i++) {
      if (this.apps[i]['item_id'] == item.item_id) {
        this.apps.splice(i, 1)
      }
    }
    ////console.log(this.apps)

  }
  onAppsDeSelectAll() {
    this.apps = []
    ////console.log(this.apps)
  }



  onDevicesSelect(item: any) {
    this.devices.push(item)
    ////console.log(this.devices)
  }
  onDevicesSelectAll(items: any) {
    ////console.log(items);
    this.devices = []
    this.devices = items
  }
  onDevicesDeSelect(item: any) {
    ////console.log(item)
    for (var i = 0; i < this.devices.length; i++) {
      if (this.devices[i]['item_id'] == item.item_id) {
        this.devices.splice(i, 1)
      }
    }
    ////console.log(this.devices)

  }
  onDeSelectAllDevices() {
    this.devices = []
    ////console.log(this.devices)
  }

  onSexeSelect(item: any) {
    this.sexes.push(item)
    ////console.log(this.sexes)
  }
  onSexeSelectAll(items: any) {
    ////console.log(items);
    this.sexes = []
    this.sexes = items
  }
  onSexeDeSelect(item: any) {
    ////console.log(item)
    for (var i = 0; i < this.sexes.length; i++) {
      if (this.sexes[i]['item_id'] == item.item_id) {
        this.sexes.splice(i, 1)
      }
    }
    ////console.log(this.sexes)

  }
  onDeSelectAllSexe() {
    this.sexes = []
    ////console.log(this.sexes)
  }
  onZoneSelect(item: any) {
    this.selectedZones = []
    this.selectedZones.push(item)
    ////console.log(this.selectedZones)
  }
/*   onZoneSelectAll(items: any) {
    ////console.log(items);
  } */
  onZoneDeSelect(item: any) {
    ////console.log(item)
    this.selectedZones = []
    ////console.log(this.selectedZones)

  }
/*   onDeSelectAllZone() {
    this.zones = []
    ////console.log(this.zones)
  } */
  parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[1], mdy[0]);
}

 datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
 }
  
 

  getData(): Observable < any[] > {
    // ['added', 'modified', 'removed']

    return this.adGroupCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return {
            id: a.payload.doc.id,
            ...data
          };
        });
      })
    );
  }
  addAdGroup() {
    this.loadProgress= true;
    var self = this
    var name = $('#adgroup').val().replace(/\s/g, "")
    this.adGroupService.newAdGroup(this.id_campagne, this.uid, name).then(res => {
      //console.log(res)
      if (res != "error") {
        
        this.loadProgress = false
        this.isAdGroup = false
        setTimeout(() => {
          document.getElementById(res).click()
          
        }, 1500)
       
        
      }
    }).catch(err => {
      this.isCreating = false
      //alert('Opération échouée')
    })
  }

  onDateStartChange(args) {
    var DATE = args.value.toString().split(' ')
    ////console.log(DATE)
    var parsed = JSON.parse(JSON.stringify(MONTH))
    var DATE_ELEMENT = parsed[0][DATE[1]]
    var day = DATE[2]
    var month = DATE_ELEMENT.number
    var years = DATE[3]
    this.startDate = `${day}/${month}/${years} `
    var date = `${years}${month}${day}`
    
    this.isCreating = true
    this.notesService.getCampaignDates(this.id_campagne, this.name).then(value => {

      if (value['startDate'] == date || value['endDate'] == date) {
        //alert('erreur de date de début')
        this.isCreating = false
      } else {
        this.notesService.updateStartDate(this.id, this.id_campagne, date, this.startDate)
        
        this.isCreating = false

      }
      

    })
    
    
  }
 /*  onEndDateChange(args) {
  var DATE = args.value.toString().split(' ')
  
    var parsed = JSON.parse(JSON.stringify(MONTH))
    var DATE_ELEMENT = parsed[0][DATE[1]]
    var day = DATE[2]
    var month = DATE_ELEMENT.number
    var years = DATE[3]


    this.endDate = `${day}/${month}/${years} `
    var date = `${years}${month}${day}`
    this.isCreating = true
    this.notesService.getCampaignDates(this.id_campagne, this.name).then(value => {

 
      if (value['startDate'] == date || value['endDate'] == date) {
    
          this.isCreating = false
        //alert('erreur de date de fin')
        

      } else {
        this.notesService.updateEndDate(this.id, this.id_campagne, date, this.endDate)

        this.isCreating = false
      }

    })
  } */
  openAddLocation() {
    this.isCiblage = true;
  }
  closeAddLocation() {
    this.isCiblage = false
  }
  targetZones() {
    this.isCreating = true
  
    this.notesService.targetLocation(this.id, this.id_campagne, this.name, this.selectedZones).then(res => {
      if (res == "ok") {
        this.isCiblage = false
        this.isCreating = false
        
      } else {
         this.isCreating = false
      }
    })
  }

  updateTargetZones() {
    this.isCreating = true
    this.notesService.updateTargetLocation(this.id, this.id_campagne, this.name, this.selectedZones).then(res => {
      this.isCiblage = false
      this.isCreating = false
    })
  }

  toggleAddNewAdGroup() {
    this.isAdGroup = true
  }
  closeAddAdGroup() {
    this.isAdGroup = false
  }
  
  updateCampaign() {

    ////console.log(this.id_campagne)
    ////console.log(this.name)
    Swal.fire({
      title: '',
      type: 'info',
      html: ' <div class="card shadow no-b r-0"><div class="card-header text-center white b-0"><h6>Modifier la campagne</h6></div>' +
        ' <div class="card-body"><form class="needs-validation" novalidate><div class="form-row">' +
        '<div class="col-md-6"> <label for="validationCustom01">Nom</label> <input type="text" class="form-control"  placeholder="Nom de la campagne" id="campagne_name" value=' + this.name + ' required><div class="valid-feedback">Looks good!</div></div>' +
        '<div class="col-md-6"> <label for="validationCustom01">Status</label>  <select class="custom-select select2" required><option value=""></option> <option value="PAUSED">Désactiver</option><option value="ENABLED">Activer</option> </select></div>' +
        '</form></div></div></div>',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="icon-check"></i> Valider',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText: '<i class="icon-remove"></i>',
      cancelButtonAriaLabel: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',

      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {

      if (result.dismiss) {
        this.isCreating = false
      } else {
        var data = []
        this.isCreating = true
        //Si nom inshangé et status inchangé
        if (this.name == $("#campagne_name").val() && this.status == $('.custom-select').val()) {
          Swal.fire({
            title: 'Modification!',
            text: 'Aucune modification détectée',
            type: 'warning',
            showCancelButton: false,
            focusConfirm: false,
            buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
            confirmButtonText: 'Ok'
          })
          this.isCreating = false
          //Si nom inchangé et status changé
        } else if (this.name == $("#campagne_name").val() && this.status != $('.custom-select').val() && $('.custom-select').val() != "") {
          data.push({
            "id": this.id_campagne,
            "name": $('#campagne_name').val(),
            "last_name": this.name,
            "email": this.email,
            "status": $('.custom-select').val(),
            "state": "1"
          })
          $.ajax({
            type: "POST",
            url: SERVER_URL+"/updateCampaign",
            datatype: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
          }).then((response) => {
            ////console.log(response)
            if (response[0].status != "error") {
              this.notesService.updateNote(this.id, {
                status: response[0].status
              })
              this.isCreating = false

              Swal.fire({
                title: 'Modification!',
                text: 'Status de la campagne modifié avec succès.',
                type: 'success',
                showCancelButton: false,
   buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
                confirmButtonText: 'Ok'
              }).then((result) => {
                this.isCreating = false
                if (result.value) {
                  window.location.reload()

                }
              })



            } else {
              this.isCreating = false
              Swal.fire({
                title: 'Erreur!',
                text: "Erreur serveur, Réssayer",
                type: 'error',
                showCancelButton: false,
   buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
                confirmButtonText: 'Ok'
              })
            }
          })
          //Si nom changé et status inchangé
        } else if (this.name != $("#campagne_name").val() && this.status == $('.custom-select').val()) {
          data.push({
            "id": this.id_campagne,
            "name": $('#campagne_name').val(),
            "last_name": this.name,
            "email": this.email,
            "status": this.status,
            "state": "2"
          })
          $.ajax({
            type: "POST",
            url: SERVER_URL+"/updateCampaign",
            datatype: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
          }).then((response) => {
            ////console.log(response)
            if (response[0].status != "error") {
              this.notesService.updateNote(this.id, {
                name: response[0].name
              })
              this.isCreating = false
              Swal.fire({
                title: 'Modification!',
                text: 'Nom de la campagne modifié avec succès.',
                type: 'success',
                showCancelButton: false,
   buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  window.location.reload()

                }
              })
            } else {
              this.isCreating = false
              Swal.fire({
                title: 'Erreur!',
                text: "Erreur serveur, Réssayer",
                type: 'error',
                showCancelButton: false,
   buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
                confirmButtonText: 'Ok'
              })

            }
          })
          //Si nom et status modifés
        } else if (this.name != $("#campagne_name").val() && this.status != $('.custom-select').val() && $('.custom-select').val() != "" && $("#campagne_name").val() != "") {
          data.push({
            "id": this.id_campagne,
            "name": $('#campagne_name').val(),
            "last_name": this.name,
            "email": this.email,
            "status": $('.custom-select').val(),
            "state": "3"
          })
          $.ajax({
            type: "POST",
            url: SERVER_URL+"/updateCampaign",
            datatype: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
          }).then((response) => {
            ////console.log(response)
            if (response[0].status != "error") {

              this.notesService.updateNote(this.id, {
                name: response[0].name,
                status: response[0].status
              })

              Swal.fire({
                title: 'Modification!',
                text: 'Le nom et le status de votre campagne ont été modifié avec succès.',
                type: 'success',
                showCancelButton: false,
   buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  window.location.reload()

                }
              })

            } else {
              this.isCreating = false
              Swal.fire({
                title: 'Erreur!',
                text: "Erreur serveur, Réssayer",
                type: 'error',
                showCancelButton: false,
   buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
                confirmButtonText: 'Ok'
              })
            }
          })
          //Si nom changé et status vide
        } else if (this.name != $("#campagne_name").val() && $('.custom-select').val() == "") {
          data.push({
            "id": this.id_campagne,
            "name": $('#campagne_name').val(),
            "last_name": this.name,
            "email": this.email,
            "status": this.status,
            "state": "4"
          })
          $.ajax({
            type: "POST",
            url: SERVER_URL+"/updateCampaign",
            datatype: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
          }).then((response) => {
            ////console.log(response)
            if (response[0].status != "error") {
              this.notesService.updateNote(this.id, {
                name: response[0].name
              })
              this.isCreating = false
              Swal.fire({
                title: 'Modification!',
                text: 'Nom de la campagne a été modifié avec succès.',
                type: 'success',
                showCancelButton: false,
   buttonsStyling: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  window.location.reload()

                }
              })
            } else {
              this.isCreating = false
              Swal.fire({
                title: 'Erreur!',
                text: "Erreur serveur, Réssayer",
                type: 'error',
                showCancelButton: false,
                confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
                confirmButtonText: 'Ok'
              })

            }
          })

        } else if ($("#campagne_name").val() == "" && $('.custom-select').val() == "") {
          Swal.fire({
            title: 'Modification!',
            text: 'Aucune Modification détectée',
            type: 'warning',
              buttonsStyling: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
            confirmButtonText: 'Ok'
          })


        } else {
          this.isCreating = false
          Swal.fire({
            title: 'Errur!',
            text: 'Données invalides',
            type: 'error',
              buttonsStyling: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
            confirmButtonText: 'Ok'
          })
        }
      }
    })
  }




  changeAdGroupStatus(id: string, adgroup_id: string, last_status: string) {
    Swal.fire({
      title: "Status groupe d'annonce",
      text: "Voulez vous modifier le status de votre groupe d'annonce!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, modifier!'
    }).then((result) => {
      if (result.value) {
        /*  */
        this.isCreating = true
        this.http.post(SERVER_URL+'/updateAdGroupStatus', {
            'adgroup_id': adgroup_id,
            'last_status': last_status
          })

          .subscribe(
            res => {
              ////console.log(res)

              this.adGroupService.updateAdgroup(id, {
                status: res['status_adgroup']
              }).then(res => {
                Swal.fire(
                  'Modifier!',
                  'Status du groupe modifié.',
                  'success'
                ).then(res => {
                  this.isCreating = false
                })
              })

            },
            err => {
              this.isCreating = false
              Swal.fire({
                title: "Service Groupe d'annonce!",
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


      }
    })
  }


  removeAdGroup(id: string, adgroup_id: string) {
    Swal.fire({
      title: "Service groupe d'annonce",
      text: "Voulez vous supprimer votre groupe d'annonce!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.value) {
        /*  */
        this.isCreating = true
        this.http.post(SERVER_URL+'/deleteAdGroup', {
            'adgroup_id': adgroup_id,

          })

          .subscribe(
            res => {
              ////console.log(res)

              this.adGroupService.deleteAdGroup(id).then(res => {
                Swal.fire(
                  'Supprimer!',
                  "Groupe d'annonce supprimé avec succès!",
                  'success'
                ).then(res => {
                  this.isCreating = false
                })
              })

            },
            err => {
              this.isCreating = false
              Swal.fire({
                title: "Service Groupe d'annonce!",
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

      }
    })
  }
  getListIdAdGroup(): Promise<any>{
    return new Promise(resolve => {
      
      this.adGroupService.getListAdGroup(this.id_campagne).forEach(child => {
        ////console.log(child)
        if (child.length == 0) {
          ////console.log("aucun groupe d'annonce")
          this.ad_groups_list_id = []
          this.ad_group_tab_content = []
        } else if (child.length == 1) {
          ////console.log("un seul groupe")
          this.ad_groups_list_id.push(child[0]['id'])
          this.ad_group_tab_content.push(child[0]["ad_group_id"])
        } else {
          
          ////console.log('plusieurs groupes')
          for (let i = 0; i < child.length; i++){
            ////console.log(`child i ${child[i]}`)
            this.ad_groups_list_id.push(child[i]['id'])
            this.ad_group_tab_content.push(child[i]["ad_group_id"])
          }
          
        }
              /*  this.ad_group_tab_content.push(child[i]["ad_group_id"])
                this.ad_groups_list_id.push(child[i]['id']) */
            
            /* if (child.length > 0) {
              ////console.log(child)
              child.forEach(element => {
                ////console.log(element['id'])
               
              })
              
            } */
            resolve('ok')
          }) 
      
    })
  }

  getListIdAd(): Promise<any>{
    
    return new Promise(resolve => {
      this.getListIdAdGroup().then(res => {
        for (let i = 0; i < this.ad_group_tab_content.length; i++){
          this.adsService.getListAd(this.ad_group_tab_content[i]).forEach(child => {
            if (child.length == 0) {
          ////console.log("aucune annonce")
          this.ads_list_id = []
          //this.ad_group_tab_content = []
        } else if (child.length == 1) {
          ////console.log("une seule annonce")
          this.ads_list_id.push(child[0]['id'])
         
        } else {
          
          ////console.log('plusieurs annonces')
          for (let i = 0; i < child.length; i++){
            this.ads_list_id.push(child[i]['id'])
           
          }
          
        }
          
            
          }) 
        }
        resolve('ok')
        
      })
      /*      */
      
    })
  }
/* 
  deleteCampaign() {
    
    
     Swal.fire({
      title: 'Vous voulez vraiment supprimer cette campagne?',
      text: "Cette action sera irréversible!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.value) {
        var data = {
          "id": this.id_campagne
        }
        $.ajax({
          type: "POST",
          url: SERVER_URL+"/deleteCampaign",
          datatype: "json",
          contentType: 'application/json',
          success: function (response) {
            ////console.log(response)
            if (response.status == "ok") {
              ////console.log(response.handler)

            }
          },
          error: function (err) {
            ////console.log(err)
          },

          data: JSON.stringify(data),
        }).then((res) => {
this.getListIdAd().then(res => {
      ////console.log(this.ad_groups_list_id)
    
      
   this.notesService.deleteNote(this.id, this.ad_groups_list_id, this.ads_list_id); 
         })
          Swal.fire({
            title: 'Supprimer!',
            text: 'Votre campagne a été supprimée avec succès.',
            type: 'success',
              buttonsStyling: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.value) {
              window.location.reload()

            }
          })


        }).catch(err => {
          Swal.fire(
            'Erreur!',
            'Une erreur est survenue lors de la suppression de votre campagne',
            'error'
          )
        })

      
      }
    })  

  } */

  goAdGroups(ad_group_name: string, idA: string, ad_group_id: string) {
    
    this.router.navigate(['ads', ad_group_name, this.id, idA, ad_group_id, this.id_campagne]).then(() => {
     
     })
   
  }
  handleErrorBudget() {
    $('#error_budget').hide()
    
  }
  OpenModifyDateCampaign() {
    this.button_payments = false
    this.modifyDate = true
    this.isSetBudget = false
    this.isAccountRechargement = false
    this.isPlacementBudgetFromAccount = false
    $("#finalButtonPublier").hide()
    $("#dateBlock").hide()
  }
  CloseUpdateCampaignDate() {
    this.modifyDate = false
    this.button_payments = true
    $("#finalButtonPublier").show()
    $("#dateBlock").show()

  }
  CloseBudgetOperation() {
    this.isSetBudget = false
    this.button_payments = true
  }
  ClosePlaceBudgetFromAccountValue() {
    this.isPlacementBudgetFromAccount = false
    this.button_payments = true
  }
   CloseRechargeAccountOperation() {
     this.isAccountRechargement = false
     this.button_payments = true
  }
  onEndDateChange(args) {
    ////console.log(args.value)
    if (args.value != undefined) {
      this.newEndDate = args.value.toString()
      
    } else {
      this.newEndDate = ""
    }
  
    }
  
  onStartDateChange(args) {
    ////console.log(args.value)
    if (args.value != undefined) {
      this.newStartDate = args.value.toString()
      ////console.log(this.newStartDate)
      
    } else {
      this.newStartDate = ""
    }
      }
  updateCampaignDate() {
    
    var parsed = JSON.parse(JSON.stringify(MONTH))
    
    var tabStart = this.startDateFrench.split("/")
    var tabEnd = this.endDateFrench.split("/")
    var frenchDateStart = tabStart[2] + "-" + tabStart[1] + "-" + tabStart[0]
    var frenchDateEnd = tabEnd[2] + "-" + tabEnd[1] + "-" + tabEnd[0]
    ////console.log(date)
    ////console.log(new Date(frenchDateStart))
    ////console.log(new Date(frenchDateEnd))
    var today_date = new Date().getDate()
    var today_day = new Date().getDay()
    var years = new Date().getFullYear()
    var month = new Date().getMonth() + 1
    new Date().valueOf()
    if (month < 10 && today_date < 10) {
      this.today =  years.toString() + "-0" + month.toString() + "-0" + today_date.toString()
    } else if (month < 10 && today_date > 10) {
      this.today = years.toString() + "-0" + month.toString() +"-"+ today_date.toString()
    } else if (month > 10 && today_date < 10) {
      this.today =  years.toString() + month.toString() + "-0" + today_date.toString()
    } else {
      this.today = years.toString() + "-"+ month.toString() +"-"+ today_date.toString()
      
    }
    var date = new Date();
    
    if (this.newEndDate == "" && this.newStartDate == "") {
      Swal.fire({
        title: 'Service Campagne',
        text: 'Renseigner au moins une date',
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.value) { }
      })
    } else if (this.newEndDate == "" && this.newStartDate != "") {
      var DATE_START = this.newStartDate.split(' ')
      var DATE_ELEMENT_START = parsed[0][DATE_START[1]]
      var _day_start = DATE_START[2]
      var _month_start = DATE_ELEMENT_START.number
      var _years_start = DATE_START[3]
      this.UpdatedStartDate = `${_day_start}/${_month_start}/${_years_start}`
      var date_start = `${_years_start}${_month_start}${_day_start}`
      var date_start_check = `${_years_start}-${_month_start}-${_day_start}`
      Swal.fire({
        title: 'Service Campagne',
        text: 'Date de début de campagne uniquement changer',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: "Confirmer"
      }).then((result) => {
        if (result.value) {
          if (new Date(frenchDateStart) < date) {
                
            Swal.fire({
              title: 'Service Campagne',
              text: 'campagne déjà commencé Vous ne pouver plus modifier la date de début',
              type: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#26a69a',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Confirmer'
            }).then((result) => {
              if (result.value) {
             
              }
            })
          } else if (new Date(frenchDateEnd) < date) {
            
            Swal.fire({
              title: 'Service Campagne',
              text: 'Campagne déjà arrivée à terme',
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#26a69a',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) { }
            })
          } else if (new Date(frenchDateStart) == date) {
            Swal.fire({
              title: 'Service Campagne',
              text: 'Cette campagne à déjà commencer à diffuser vous pouver uniquement modifier la date de fin',
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#26a69a',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) { }
            })
          } else if (new Date(frenchDateEnd) == date) {
            Swal.fire({
              title: 'Service Campagne',
              text: "Cette campagne se termine aujourd'hui vous pouver uniquement modifier la date de fin",
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#26a69a',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) { }
            })
              
          } else {
            if (new Date(date_start_check) > new Date()) {
              Swal.fire({
                title: 'Service Campagne',
                text: "Date valide",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok, confirmer'
              }).then((result) => {
                  this.modifyDate = false
                 this.isRoller = true
                if (result.value) {
                   this.notesService.updateStartDate(this.id, this.id_campagne, date_start, this.UpdatedStartDate).then(res=>{
                     if (res != "error") {
                       this.isRoller = false
                       this.modifyDate = true
                     }
                   })
          
                }
              })
            
            } else if (date_start_check == this.today) {
              
              Swal.fire({
                title: 'Service Campagne',
                text: "Campagne commence aujourd'hui",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok, confirmer'
              }).then((result) => {
                 this.modifyDate = false
                 this.isRoller = true
                if (result.value) {
                   this.notesService.updateStartDate(this.id, this.id_campagne, date_start, this.UpdatedStartDate).then(res=>{
                     if (res != "error") {
                       this.isRoller = false
                       this.modifyDate = true
                     }
                   })
          
                }
              })
            } else if (new Date(date_start_check) > new Date(frenchDateEnd)) {
              Swal.fire({
                title: 'Service Campagne',
                text: "date de début ne peut être après la date de fin",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
          
          
                }
              })
            } else if (date_start_check == frenchDateEnd) {
              Swal.fire({
                title: 'Service Campagne',
                text: "Date de début et date de fin ne peuvent être définies à la même date",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
          
          
                }
              })
            } else {
               //alert(date_start_check+" "+ this.today)
              Swal.fire({
                title: 'Service Campagne',
                text: "Date de début"+new Date(date_start_check)+" ne peut être définie dans le passé",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) { }
              })
            }
      
 
          }
          
        }
      }
    
      )
      
    } else if (this.newStartDate == "" && this.newEndDate != "") {
    
      var DATE_END = this.newEndDate.split(' ')
     
      var DATE_ELEMENT_END = parsed[0][DATE_END[1]]
      var _day_end = DATE_END[2]
      var _month_end = DATE_ELEMENT_END.number
      var _years_end = DATE_END[3]
      this.UpdatedEndDate = `${_day_end}/${_month_end}/${_years_end}`
      var date_end = `${_years_end}${_month_end}${_day_end}`
      var date_end_check = `${_years_end}-${_month_end}-${_day_end}`
        Swal.fire({
        title: 'Service Campagne',
        text: 'Date de début inchangé, date de fin changée',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: "Confirmer"
      }).then((result) => {
        if (result.value) {
          if (new Date(frenchDateEnd) < date) {
         Swal.fire({
                title: 'Service Campagne',
                text: "Cette campagne est déjà arrivée à terme",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
          
          
                }
              })
    } else if (new Date(frenchDateEnd) == date) { 
      Swal.fire({
                title: 'Service Campagne',
                text: "Cette campagne se termine aujourd'hui, vous voulez prolonger sa date de fin",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok, prolonger'
      }).then((result) => {
                this.modifyDate = false
                
                this.isRoller = true
                if (result.value) {
                   this.notesService.updateEndDate(this.id, this.id_campagne, date_end, this.UpdatedEndDate).then(res=>{
                     if (res != "error") {
                       this.isRoller = false
                       this.modifyDate = true
                     }
                   })
          
                }
              })
    } else {
            if (new Date(date_end_check) < new Date()) {
          Swal.fire({
                title: 'Service Campagne',
                text: "Date de fin ne peut être définie dans le passé",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  
          
                }
              })
      
            } else if (date_end_check== this.today) {
                Swal.fire({
                title: 'Service Campagne',
                text: "Date de fin définie à la date d'aujourd'hui",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                this.modifyDate = false
                
                this.isRoller = true
                if (result.value) {
                   this.notesService.updateEndDate(this.id, this.id_campagne, date_end, this.UpdatedEndDate).then(res=>{
                     if (res != "error") {
                       this.isRoller = false
                       this.modifyDate = true
                     }
                   })
          
                }
              })
         
      } else if (new Date(date_end_check) < new Date(frenchDateStart)) {
            Swal.fire({
                title: 'Service Campagne',
                text: "Date de fin ne peut être définie avant la date de début",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  
          
                }
              })
      } else if (date_end_check==frenchDateStart) {
      
              Swal.fire({
                title: 'Service Campagne',
                text: "Date de début et date de fin ne peuvent être définies à la même date",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  
          
                }
              })
      } else{
         Swal.fire({
                title: 'Service Campagne',
                text: "Vous êtes sur des données saisies ?",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, sûr!'
              }).then((result) => {
                this.modifyDate = false
                
                this.isRoller = true
                if (result.value) {
                   this.notesService.updateEndDate(this.id, this.id_campagne, date_end, this.UpdatedEndDate).then(res=>{
                     if (res != "error") {
                       this.isRoller = false
                       this.modifyDate = true
                     }
                   })
          
                }
              })
      }
      
 
    }
        }
      })
     
      
    } else {
      var DATE_START = this.newStartDate.split(' ')
      var DATE_ELEMENT_START = parsed[0][DATE_START[1]]
      var _day_start = DATE_START[2]
      var _month_start = DATE_ELEMENT_START.number
      var _years_start = DATE_START[3]
      this.UpdatedStartDate = `${_day_start}/${_month_start}/${_years_start}`
      var date_start = `${_years_start}${_month_start}${_day_start}`
      var date_start_check = `${_years_start}-${_month_start}-${_day_start}`

       var DATE_END = this.newEndDate.split(' ')
     
      var DATE_ELEMENT_END = parsed[0][DATE_END[1]]
      var _day_end = DATE_END[2]
      var _month_end = DATE_ELEMENT_END.number
      var _years_end = DATE_END[3]
      this.UpdatedEndDate = `${_day_end}/${_month_end}/${_years_end}`
      var date_end = `${_years_end}${_month_end}${_day_end}`
      var date_end_check = `${_years_end}-${_month_end}-${_day_end}`
      if (frenchDateStart == this.today ) {
       Swal.fire({
              title: 'Service Campagne',
              text: "Cette campagne Commence aujourd'hui vous pouver uniquement modifier la date de fin",
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#26a69a',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) { }
            })
    } else if (new Date(frenchDateEnd) < new Date()) {
      Swal.fire({
              title: 'Service Campagne',
              text: "Cette campagne est arrivée à terme",
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#26a69a',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) { }
            })
    } else if (new Date(frenchDateStart) < new Date()) {
    Swal.fire({
                title: 'Service Campagne',
                text: "Cette campagne à déjà commencé à diffuser, seul sa date de fin sera changée",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok, changer'
              }).then((result) => {
                 this.modifyDate = false
                
                this.isRoller = true
                if (result.value) {
                   this.notesService.updateEndDate(this.id, this.id_campagne, date_end, this.UpdatedEndDate).then(res=>{
                     if (res != "error") {
                       this.isRoller = false
                       this.modifyDate = true
                     }
                   })
          
                }
              })
    } else if (frenchDateEnd == this.today) { 
        Swal.fire({
                title: 'Service Campagne',
                text: "Cette campagne se termine aujourd'hui, vous pouvez prolonger sa date de fin",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok, prolonger'
              }).then((result) => {
                this.modifyDate = false
                
                this.isRoller = true
                if (result.value) {
                   this.notesService.updateEndDate(this.id, this.id_campagne, date_end, this.UpdatedEndDate).then(res=>{
                     if (res != "error") {
                       this.isRoller = false
                       this.modifyDate = true
                     }
                   })
          
                }
              })
      } else {
        if(date_start_check == this.today && new Date(date_end_check) > new Date()){
           Swal.fire({
                title: 'Service Campagne',
                text: "La campagne va commencer aujourd'hui",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok, confirmer'
           }).then((result) => {
                  this.modifyDate = false
                 this.isRoller = true
                if (result.value) {
                  this.notesService.updateDates(this.id, this.id_campagne, date_start, this.UpdatedStartDate, date_end, this.UpdatedEndDate).then(res=>{
                     if (res != "error") {
                       this.isRoller = false
                       this.modifyDate = true
                     }
                   })
          
                }
               
              })
        
     
      }else if (new Date(date_start_check) < new Date()  && new Date(date_end_check) > new Date()) {
        Swal.fire({
          title: 'Service Campagne',
          text: "Date de début ne peut être définie dans le passé",
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#26a69a',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.value) {
                  
          
          }
        })
      }else if(new Date(date_end_check) < new Date()){
          Swal.fire({
                title: 'Service Campagne',
                text: "Date de fin ne peut être définie dans le passé",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  
          
                }
              })
      } else if (new Date(date_start_check) > new Date(date_end_check)) {
   
         Swal.fire({
                title: 'Service Campagne',
                text: "date de début ne peut être après la date de fin",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  
          
                }
              })
      } else if (date_start_check==this.today && date_end_check != this.today) {
    
       Swal.fire({
                title: 'Service Campagne',
                text: "Campagne va commencer aujourd'hui",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok, commencer'
              }).then((result) => {
                 this.modifyDate = false
                 this.isRoller = true
                if (result.value) {
                  this.notesService.updateDates(this.id, this.id_campagne, date_start, this.UpdatedStartDate, date_end, this.UpdatedEndDate).then(res=>{
                     if (res != "error") {
                       this.isRoller = false
                       this.modifyDate = true
                     }
                   })
          
                }
              })
      }else if (date_end_check == this.today) {
        
          Swal.fire({
                title: 'Service Campagne',
                text: "Impossible de finir une campagne qui n'a pas commencé à diffuser",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  
          
                }
              })
      } else if (date_end_check==date_start_check) {
      
          Swal.fire({
                title: 'Service Campagne',
                text: "Date de début et date de fin ne peuvent être définies à la même date",
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
                if (result.value) {
                  
          
                }
              })
      
        } else {
           Swal.fire({
                title: 'Service Campagne',
                text: "Vous êtes sur des données saisies ?",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#26a69a',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, sûr!'
              }).then((result) => {
                 this.modifyDate = false
                 this.isRoller = true
                if (result.value) {
                  this.notesService.updateDates(this.id, this.id_campagne, date_start, this.UpdatedStartDate, date_end, this.UpdatedEndDate).then(res=>{
                     if (res != "error") {
                       this.isRoller = false
                       this.modifyDate = true
                     }
                   })
          
                }
              })
      
      }
      
 
    }
    }
    
    
   



    
  
   
    

   
    /* var today_date = new Date().getDate()
    var today_day = new Date().getDay()
    var years = new Date().getFullYear()
    var month = new Date().getMonth() + 1
    
    if (month < 10 && today_date < 10) {
      this.today = "0" + today_date.toString() + "/0" + month.toString() + "/" + years.toString()
    } else if (month < 10 && today_date > 10) {
      this.today = today_date.toString() + "/0" + month.toString() + "/" + years.toString()
    } else if (month > 10 && today_date < 10) {
      this.today = "0" + today_date.toString() + "/" + month.toString() + "/" + years.toString()
    } else {
      this.today = today_date.toString() + "/" + month.toString() + "/" + years.toString()
    }


    ////console.log(`startDate: ${this.startDate}, updatedStartDate: ${this.UpdatedStartDate}`)
    ////console.log(`endDate: ${this.endDate}, updatedEndDate: ${this.UpdatedEndDate}`)
    ////console.log(`startDateFrench: ${this.startDateFrench.replace("/", "-").replace("/", "-")}, endDateFrench: ${this.endDateFrench.replace("/", "-").replace("/", "-")}`)
    ////console.log(this.today)
 */
  }



  listCampagne() {
    this.router.navigate(['CampaignList']).then((value) => {
      if (value === true) {
        window.location.replace(SERVER.url_redirect)
        
      }
    })
    
  }
  
  setStartDate(): Promise<any> {
    return new Promise(resolve => {
      var DATE = this.newStartDate.split(' ')
  
    var parsed = JSON.parse(JSON.stringify(MONTH))
    var DATE_ELEMENT = parsed[0][DATE[1]]
    var day = DATE[2]
    var month = DATE_ELEMENT.number
    var years = DATE[3]


      //this.startDate = `${day}/${month}/${years}`
      this.UpdatedStartDate = `${day}/${month}/${years}`
    var date = `${years}${month}${day}`
    this.isCreating = true
if (this.startDate == date || this.endDate == date) {
     /*    ////console.log(`start date from firebase: ${value['startDate']} end date from firebase: ${value['endDate']}`)
      ////console.log(`end date from me: ${date}`)  */
       resolve('error')
        
      } else {
  this.notesService.updateStartDate(this.id, this.id_campagne, date, this.UpdatedStartDate)
  ////console.log(this.id)
          
        resolve('ok')
      }
    })
    
  
    
  }

  setEndDate(): Promise<any> {
    return new Promise(resolve => {
      var DATE = this.newEndDate.split(' ')
  
    var parsed = JSON.parse(JSON.stringify(MONTH))
    var DATE_ELEMENT = parsed[0][DATE[1]]
    var day = DATE[2]
    var month = DATE_ELEMENT.number
    var years = DATE[3]


      //this.endDate = `${day}/${month}/${years}`
      this.UpdatedEndDate = `${day}/${month}/${years}`
    var date = `${years}${month}${day}`
    this.isCreating = true
if (this.endDate == date || this.startDate == date) {
     /*    ////console.log(`start date from firebase: ${value['startDate']} end date from firebase: ${value['endDate']}`)
      ////console.log(`end date from me: ${date}`)  */
          resolve('error')
          

      } else {
        this.notesService.updateEndDate(this.id, this.id_campagne, date, this.UpdatedEndDate)
        resolve('ok')
      }
    })
  }
  
 
  handleSimulatedImpressionsCount() {
    ////console.log('keyup')
    $('#error_recharge').hide()
    this.isSimulation = true
    var montant = $("#montant").val()
    if (montant == "" ) {
    
      this.number_of_impressions_simulated = 0
      this.my_gain = 0
      this.budget_to_place = 0
      this.error_recharge = "Saisir un budget"
       $('#error_recharge').show()
    } else if (montant < MIN_BUDGET_VALUE) {
        this.number_of_impressions_simulated = 0
      this.my_gain = 0
      this.budget_to_place = 0
      this.error_recharge = "Budget doit être supérieur ou égal à 10 000 FCFA"
      $('#error_recharge').show()
    } else if (montant > MAX_BUDGET_VALUE) {
         this.number_of_impressions_simulated = 0
      this.my_gain = 0
      this.budget_to_place = 0
      this.error_recharge = "Budget indisponible"
      $('#error_recharge').show()
    } else{
      this.my_gain = (20 * montant) / 100
      this.budget_to_place = montant - this.my_gain
      this.number_of_impressions_simulated = parseInt(((this.budget_to_place *1000) / 33.3).toString())
      this.montant = montant
      //var budget_to_place_in_dollar = budget_to_place * 550
      
      
    }
  }

   handleIfValide() {
    ////console.log('keyup')
    $('#error_recharge').hide()
    var montant = $("#montant").val()
    if (montant < 20000) {
    this.montant = 0
      $('#error_recharge').show()
    } else if(montant==""){
    this.montant = 0
       $('#error_recharge').show()
    } else{
     this.montant = montant
      //var budget_to_place_in_dollar = budget_to_place * 550
      
      
    }
   }
  
  handleIfBudgetToPlaceFromAccountIsValid() {
    $('#error_recharge').hide()
    var montant = parseInt($("#montant").val())


    if (montant > this.accountValue) {
      this.montant = 0
       this.number_of_impressions_simulated = 0
      this.my_gain = 0
      this.budget_to_place = 0
      $('#error_recharge').show()
    } else if(montant==null){
      this.montant = 0
      this.number_of_impressions_simulated = 0
      this.my_gain = 0
      this.budget_to_place = 0
       $('#error_recharge').show()
    } else if(montant < 10000){
       this.montant = 0
       this.number_of_impressions_simulated = 0
      this.my_gain = 0
      this.budget_to_place = 0
      $('#error_recharge').show()
    }else{
     this.my_gain = (20 * montant) / 100
      this.budget_to_place = montant - this.my_gain
      this.number_of_impressions_simulated = parseInt(((this.budget_to_place *1000) / 33.3).toString())
      this.montant = montant
      
      
    }
  }

   handleBudgetPlacement() {
     this.isAccountRechargement = false
     this.isPlacementBudgetFromAccount = false
     this.button_payments = false
    Swal.fire({
        title: 'Service Campagne',
        text: "Vous allez placer un budget pour votre campagne, veuillez vous assurez que les dates de début et de fins sont définies aux dates voulues",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, Je confirme ces dates'
      }).then((result) => {
        if (result.value) {
          this.modifyDate = false
          this.isSetBudget = true
         }
      })
    
    
   }
  handlePlaceBudgetFromSolde() {
    this.isAccountRechargement = false
    this.isSetBudget = false
    this.button_payments = false
    Swal.fire({
        title: 'Service Campagne',
        text: "Vous allez placer un budget pour votre campagne, veuillez vous assurez que les dates de début et de fins sont définies aux dates voulues",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#26a69a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, Je confirme ces dates'
      }).then((result) => {
        if (result.value) {
          this.modifyDate = false
          this.isPlacementBudgetFromAccount = true
         }
      })
  }
  
   handleAccountRechargement() {
   
     this.modifyDate = false;
     this.isSetBudget = false
     this.isPlacementBudgetFromAccount = false;
     this.button_payments = false
     this.isAccountRechargement = true
    
    
  }
  defineBudget() {
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
          if (this.montant < 10000) {
         Swal.fire({
          title: "Service budget",
          text: "Montant invalide",
          type: 'warning',
          showCancelButton: true,
           confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
      cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
          confirmButtonText: 'réessayer '
        }).then((result) => {
          if (result.value) {
          
          }
        })
    } else if (this.montant > 1000000) {
       Swal.fire({
          title: "Service budget",
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
    } else {
      Swal.fire({
        title: "Service budget",
        html: "<span>Vous allez procéder au paiement dans quelques instant saisissez le <strong class='adafri font-weight-bold adafri-police-18'>#144#391#</strong> sur votre téléphone pour payer avec orange money<span>",
        type: 'info',
        showCancelButton: true,
        confirmButtonClass: "btn btn-sm white text-black-50 r-20 border-grey",
        cancelButtonClass: "btn btn-sm white text-danger r-20 border-red",
        confirmButtonText: 'Procéder au paiement',
        cancelButtonText: "annuler"
      }).then((result) => {
        if (result.value) {
            var self = this
          this.isCreating = true
                
          var key = this.generate(100)
          localStorage.setItem(key, this.budget_to_place.toString())
          this.auth.updateUser(this.uid, {paymentKey: key})
    
      setTimeout(function () {
    
        var btn = document.getElementById("budgetSet");
        var selector = pQuery(btn);
        (new PayExpresse({
          item_id: 1,
        })).withOption({
            requestTokenUrl: SERVER_URL+'/Budget/'+self.id+"/"+self.id_campagne+"/"+self.budgetId+"/"+ self.montant+"/"+self.budget_to_place+"/"+self.dure_campagne+"/"+redirect,
            method: 'POST',
            headers: {
                "Accept": "application/json"
          },
       
          
            //prensentationMode   :   PayExpresse.OPEN_IN_POPUP,
            prensentationMode: PayExpresse.OPEN_IN_POPUP,
            didPopupClosed: function (is_completed, success_url, cancel_url) {
              self.isCreating = false
              if (is_completed === true) {
                 
                
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
     
    
     /*  $('#button_modal_define_budget').trigger('click') */
    

      
      
      
    
  }





  defineBudgetFromAccount() {
    var self = this
    var montant = parseInt($("#montant").val())
    var newAccountValue = this.accountValue - montant
    if (montant > this.accountValue || montant < 10000) {
      $('#error_recharge').show()
    } else if (montant == null) {
      $('#error_recharge').show()
       
    } else {
      this.isCreating = true
      this.isPlacementBudgetFromAccount = false
      this.montant = montant
         this.http.post(SERVER_URL+'/setBudgetFromAccount', {
      'budgetId': this.budgetId,
           'amount': this.budget_to_place,
      'dure': this.dure_campagne,
    })
      .subscribe(
        res => {
          
          if (res[0]['status'] == "ok") {
            this.notesService.updateNote(this.id, { budget: this.budget_to_place, dailyBudget: res[0]['dailyBudget'] }).then(res => {
              
              if (res == "ok") {
                 
                      this.auth.updateUser(this.uid, {account_value: newAccountValue }).then(res => {
                        
                        if (res == "ok") {
                          self.isCreating = false
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
                   window.location.reload()
                  }else{
                    window.location.reload()
                  }
                })
                        } else {
                          self.isCreating = false
                        }
              })
              } else {
                self.isCreating = false
              }
                 
               })
            
          } else {
            self.isCreating = false
          }
          
          
        },
        err => {
          Swal.fire({
      title: 'Service Campagne!',
      text: 'Erreur.',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.value) {}
    })
        }
      );
    }
  }

  encrypted(text, password){

  return CryptoJS.AES.encrypt(text, password);
}
  
  
  defineAmountAccountBeforeBudget() {


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
              /* var crypt = this.cryptMoney(this.montant.toString()) */
              this.isCreating = true
       var key = this.generate(100)
      localStorage.setItem(key, this.montant.toString())
      this.auth.updateUser(this.uid, {paymentKey: key})
     /*  var crypt = this.encrypted(this.montant.toString(), this.uid) */
      $('#closeModalRecharge').trigger('click')
      var self = this
      setTimeout(function () {
    
        var btn = document.getElementById("budgetSet");
        var selector = pQuery(btn);
        (new PayExpresse({
          item_id: 1,
        })).withOption({
            requestTokenUrl: SERVER_URL+'/rechargeAmountBeforeBudget/'+ self.montant + "/"+self.id_campagne+"/"+redirect,
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
                selector.prop('disabled', false);
            },
            didReceiveError: function (error) {
                //alert('erreur inconnu');
              selector.prop('disabled', false);
              self.isCreating = false
            },
            didReceiveNonSuccessResponse: function (jsonResponse) {
                ////console.log('non success response ', jsonResponse);
                //alert(jsonResponse.errors);
              selector.prop('disabled', false);
              self.isCreating = false
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
      }

        })
   
     

  }
   generate(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

}
