import 'es6-shim';
import {App, IonicApp, Platform, MenuController, Alert} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login';
import {MPinPage} from './pages/m-pin/m-pin';
//import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';
import {ListPage} from './pages/list/list';
import {BroadbandAvailabilityPage} from './pages/broadband-availability/broadband-availability';
import {EfmAvailabilityPage} from './pages/efm-availability/efm-availability';
import {EthernetFttcPage} from './pages/ethernet-fttc/ethernet-fttc';
import {DomainAvailabilityPage} from './pages/domain-availability/domain-availability';
import {CommonService} from './providers/common-service/common-service'


@App({
  templateUrl: 'build/app.html',
  providers: [CommonService],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {


  // make HelloIonicPage the root (or first) page
  //rootPage: any = LoginPage;

  //rootPage: any = LoginPage;

  rootPage:any;

  //pages: Array<{title: string, section: string, component: any}>;

  pages:any;

  constructor(
    private app: IonicApp,
    private platform: Platform,
    private menu: MenuController
  ) {
    this.initializeApp();
    this.pages =  [
                    {
                        "name":"Check Availability",
                        "Action":
                  				[
                            { title: 'ADSL & FTTC', component: BroadbandAvailabilityPage },
                            { title: 'EFM', component: EfmAvailabilityPage },
                            { title: 'Ethernet FTTC', component: EthernetFttcPage },
                            { title: 'Domain', component: DomainAvailabilityPage }
                  				]
                    },
                    {
                        "name":"Action2",
                        "Action":
                  				[
                            { title: 'My third List', component: ListPage },
                            { title: 'My Fourth List', component: ListPage }
                  				]
                    }
                ];

    /*localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('MPin');*/

    // make rootPage based on Login Conditions
    let username = localStorage.getItem('username');
    let password = localStorage.getItem('password');
    let MPin = localStorage.getItem('MPin');

    if(username != '' && username != null && password != '' && password != null && MPin != '' && MPin != null)
    {
        this.rootPage = MPinPage;
    }
    else
    {
        this.rootPage = LoginPage;
    }

    this.rootPage = ListPage;

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });

  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }

  Logout() {
    this.menu.close();
    let nav = this.app.getComponent('nav');
    let alert = Alert.create({
      title: 'Logout?',
      subTitle: 'Are you sure you want to logout?',
      buttons: [
        {
          text:'Yes',
          handler : () => {nav.setRoot(MPinPage);}
        },
        {
          text:'No',
          handler : () => {alert.dismiss();}
        }
      ]
    });

    nav.present(alert);
  }

}
