import {IonicApp, Page, NavController, MenuController, Loading, Alert, Platform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {Network, Connection} from 'ionic-native';
//import {Http} from 'angular2/http';

/*
  Generated class for the CommonService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CommonService {
  //data: any = null;
  APIUrl:any = '';
  networkState:any = '';


  constructor(private nav: NavController, private platform: Platform) {
    this.nav = nav;
    this.platform = platform;
    this.APIUrl = 'http://nc2.cerberusnetworks.co.uk/mobile/ionic/';

  }

  createTimeout(timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(null),timeout)
        })
    }

  CheckPostcode(postcode)
  {
    var postcode_pattern = /^([A-Za-z][0-9]\s[0-9][A-Za-z][A-Za-z]|[A-Za-z][0-9][0-9]\s[0-9][A-Za-z][A-Za-z]|[A-Za-z][A-Za-z][0-9]\s[0-9][A-Za-z][A-Za-z]|[A-Za-z][A-Za-z][0-9][0-9]\s[0-9][A-Za-z][A-Za-z]|[A-Za-z][0-9][A-Za-z]\s[0-9][A-Za-z][A-Za-z]|[A-Za-z][A-Za-z][0-9][A-Za-z]\s[0-9][A-Za-z][A-Za-z])$/;

    if(!postcode_pattern.test(postcode))
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  CheckConnection()
  {
      if(Network.connection === Connection.NONE)
      {
        return false;
      }
      else
      {
        return true;
      }
  }
}
