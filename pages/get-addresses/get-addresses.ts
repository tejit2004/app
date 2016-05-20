import {Page, NavController, Alert, Loading, NavParams, ViewController} from 'ionic-angular';
import { Component, Inject} from 'angular2/core';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {CommonService} from '../../providers/common-service/common-service';
//import { BroadbandAvailabilityPage} from '../broadband-availability/broadband-availability';

/*
  Generated class for the GetAddressesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/get-addresses/get-addresses.html',
  providers: [HTTP_PROVIDERS, CommonService]
})
export class GetAddressesPage {

  url:any;
  results:any;
  loading:any;
  http:Http;
  addressAvailable:boolean;
  constructor(public nav: NavController, params: NavParams, private viewCtrl: ViewController, private httpService: Http, private commonservice: CommonService)
  {

      this.commonservice = commonservice;
      this.url = this.commonservice.APIUrl + 'getAddressRef.php?postcode='+params.get('postcode');

      this.addressAvailable = false;
      this.http = httpService;
      this.getAddresses();

  }

  public presentError(title, msg) {

    let alert = Alert.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    this.nav.present(alert);
  }



  public presentLoading() {
     this.loading = Loading.create({
       content: "Please wait...",
       duration: 0,
       dismissOnPageChange: true
     });
     this.nav.present(this.loading);
     return false;
   }


getAddresses()
{
    //this.presentLoading();
    this.http.get(this.url).subscribe(
      (response) =>
      {

        //this.loading.dismiss();
        this.results = response.json().results;
        this.addressAvailable = true;
        if(this.results.ret == false)
        {
            this.dismiss();
            this.presentError('Error!', this.results.Error);
        }

      },
      (error) => {
          this.dismiss();
          this.presentError('Error', 'Unexpected error. Please try again.');
      },
      () => { }
    )
  }

 selectAddress(AddressRefNum, DistrictCode)
 {
   let data = { 'action':'Select','AddressRefNum': AddressRefNum,  'DistrictCode': DistrictCode};
   this.viewCtrl.dismiss(data);
 }

  dismiss()
  {
    //this.nav.pop();
      let data = { 'action': 'Close'};
      this.viewCtrl.dismiss();

  }
}
