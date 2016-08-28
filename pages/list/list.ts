import { Component} from '@angular/core';
import { NavController, MenuController, NavParams, AlertController, LoadingController, Platform} from 'ionic-angular';
import {Toast, InAppBrowser} from 'ionic-native';
import {HTTP_PROVIDERS, Http} from '@angular/http';
import {CommonService} from '../../providers/common-service/common-service';
import {CasesPage} from '../cases/cases';
import {ServiceResultPage} from '../service-result/service-result';
import {ServiceStatusPage} from '../service-status/service-status';

@Component({
  templateUrl: 'build/pages/list/list.html',
  providers: [HTTP_PROVIDERS, CommonService]
})
export class ListPage {
  http:Http;
  results:any;
  loading:any;
  url:any;
  available:boolean;

  constructor(private nav: NavController, private httpService: Http, private commonservice: CommonService, private platform: Platform, private menu: MenuController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

    this.http = httpService;
    this.commonservice = commonservice;
    this.results = [];
    //this.menu.swipeEnable(true);
    this.available = false;
    this.onLoad();
  }

  public presentLoading() {
     this.loading = this.loadingCtrl.create({
       content: "Please wait...",
       duration: 0,
       dismissOnPageChange: false
     });
     this.loading.present();
   }

   presentError(title, msg) {

     let alert = this.alertCtrl.create({
       title: title,
       subTitle: msg,
       buttons: ['OK']
     });
     alert.present();
   }

   Launch(url) {
     this.platform.ready().then(() => {
           InAppBrowser.open(url, "_system", "location=true");
       });
   }

   GotoCases() {
     this.nav.push(CasesPage);
   }

   GotoServices(type) {
     this.nav.push(ServiceResultPage, {OrderType:type});
   }

   gotoServiceStatus() {
     this.nav.push(ServiceStatusPage);
   }

  onLoad()
  {

      let connection = this.commonservice.CheckConnection();

      if(connection === false)
      {
        //this.presentError('Error', 'Please check your Network connection.');
        this.commonservice.createTimeout(300).then(() => {
          Toast.show(this.commonservice.networkMsg, this.commonservice.networkMsgTime, this.commonservice.networkMsgpos).subscribe(
            toast => {
              console.log(toast);
            }
          );
        })
        return false;
      }

     let clientID = sessionStorage.getItem("clientID");
     this.url = this.commonservice.APIUrl+'home.php?ClientID='+clientID;

     //this.presentLoading();
     this.http.get(this.url).subscribe((response) => {
       this.available = true;
       this.results = response.json();
       //this.loading.dismiss();
      },
      (error) => {
          //this.presentError('Error', 'Unexpected error. Please try again.');
          this.presentError('Error', 'Unexpected error. Please try again.');
      },
      () => {  })
  }
}
