import { Component, Inject} from '@angular/core';
import {NavController, Platform, LoadingController, NavParams} from 'ionic-angular';
import {HTTP_PROVIDERS, Http} from '@angular/http';
import {CommonService} from '../../providers/common-service/common-service';
import {Toast} from 'ionic-native';
import {ServiceDetailPage} from '../service-detail/service-detail';

/*
  Generated class for the ServiceResultPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/service-result/service-result.html',
  providers: [HTTP_PROVIDERS, CommonService]
})
export class ServiceResultPage {
  http:Http;
  results:any;
  loading:any;
  url:any;
  orientation:string;
  select_type:string;
  OrderType:string;
  type:string;
  name:string;
  srno:string;
  count:boolean;
  orient:any;
  showadditionalfields:boolean;

  private availabilityResult:boolean;
  constructor(private platform: Platform,private nav: NavController, private httpService: Http, navParams: NavParams, private commonservice: CommonService, private loadingCtrl: LoadingController) {

    this.http = httpService;
    this.results = [];
    this.availabilityResult = false;

    this.OrderType = navParams.get('OrderType');
    if(this.OrderType == 'On Order' || this.OrderType == 'Awaiting Tail Order')
    {
      this.showadditionalfields = true;
    }
    else
    {
      this.showadditionalfields = false;
    }
    this.type = navParams.get('type');
    if(this.type == '' || this.type == 'undefined' || this.type == undefined)
    {
      this.type = '';
    }
    this.name = navParams.get('name');
    if(this.name == '' || this.name == 'undefined' || this.name == undefined)
    {
      this.name = '';
    }
    this.srno = navParams.get('srno');
    if(this.srno == '' || this.srno == 'undefined' || this.srno == undefined)
    {
      this.srno = '';
    }
    this.orient = this.commonservice.changeOrientation();
    this.platform.ready().then(() => {
      this.onSubmit();
    });

  }

  ngOnInit() {
    window.onorientationchange = ((event) => {
      //setTimeout(() => {
        this.orient = this.commonservice.changeOrientation();
      //});
    });
  }

  public presentLoading() {
     this.loading = this.loadingCtrl.create({
       content: "Please wait...",
       duration: 0,
       dismissOnPageChange: false
     });
     this.loading.present();
   }

  onSubmit()
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
     if(this.OrderType != '' && this.OrderType != 'undefined' && this.OrderType != undefined)
     {
       this.url = this.commonservice.APIUrl+'view_services.php?clientID='+clientID+'&type=Connection&name='+this.name+'&srno='+this.srno+'&OrderType='+this.OrderType;

     }
     else
     {
         this.url = this.commonservice.APIUrl+'view_services.php?clientID='+clientID+'&type='+this.type+'&name='+this.name+'&srno='+this.srno;
     }


     this.availabilityResult = false;
     this.presentLoading();


     this.http.get(this.url).subscribe((response) => {

       this.results = response.json().results;

        if(this.results.ret == true)
        {
              this.availabilityResult = true;
              this.count = true;
              this.loading.dismiss();
        }
        else if(this.results.ret == false)
        {
          this.count = false;
          this.availabilityResult = true;
          this.loading.dismiss();

        }
      },
      (error) => {
          //this.presentError('Error', 'Unexpected error. Please try again.');
          this.loading.dismiss();
      },
      () => {  })
  }

  idTapped(event, ID, type)
  {
    this.nav.push(ServiceDetailPage, {ID:ID, type:type});
  }

}
