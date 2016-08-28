import { Component } from '@angular/core';
import { NavController, Platform, NavParams, MenuController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import {HTTP_PROVIDERS, Http} from '@angular/http';
import {CommonService} from '../../providers/common-service/common-service';
import {Toast} from 'ionic-native';

/*
  Generated class for the RadiusFullLogPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/radius-full-log/radius-full-log.html',
  providers: [HTTP_PROVIDERS, CommonService]
})
export class RadiusFullLogPage {
  CliNo:string;
  http:Http;
  results:any;
  loading:any;
  url:any;
  isCount:boolean;


  private availabilityResult:boolean;

  constructor(private nav: NavController, private platform: Platform, private httpService: Http, private commonservice: CommonService, navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private modalCtrl: ModalController) {

    this.CliNo = navParams.get("CliNo");


    this.http = httpService;
    this.nav = nav;
    this.commonservice = commonservice;
    this.results = [];
    this.availabilityResult = false;
    this.platform.ready().then(() => {
      this.onSubmit();
    });
  }

  public presentError(title, msg) {

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  public presentLoading() {
     this.loading = this.loadingCtrl.create({
       content: "Please wait...",
       duration: 0,
       dismissOnPageChange: false
     });
     this.loading.present(this.loading);
   }

   onSubmit()
   {

       let connection = this.commonservice.CheckConnection();

       if(connection === false)
       {
         this.commonservice.createTimeout(300).then(() => {
           Toast.show(this.commonservice.networkMsg, this.commonservice.networkMsgTime, this.commonservice.networkMsgpos).subscribe(
             toast => {
               console.log(toast);
             }
           );
         })
         return false;
       }


      this.url = this.commonservice.APIUrl+'show_full_log.php?CliNo='+this.CliNo;

      this.availabilityResult = false;
      this.presentLoading();


      this.http.get(this.url).subscribe((response) => {

        this.results = response.json();
        let navLoading = this.loading.dismiss();
         if(this.results.ret == true)
         {
            this.availabilityResult = true;

            if(this.results.data.length > 1)
            {
              this.isCount = true;
            }
            else
            {
              this.isCount = false;
            }
         }
         else
         {
           this.isCount = true;
           navLoading.then(() => {
            this.presentError('Error', this.results.error);
           });
         }
       },
       (error) => {
         let navLoading = this.loading.dismiss();
         navLoading.then(() => {
          this.presentError('Error', 'Unexpected error. Please try again.');
         });
       },
       () => {  })
   }

}
