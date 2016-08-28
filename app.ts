import 'es6-shim';
import {ViewChild, Component} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, AlertController, Nav} from 'ionic-angular';
import {StatusBar, Splashscreen, Push} from 'ionic-native';
import {LoginPage} from './pages/login/login';
import {MPinPage} from './pages/m-pin/m-pin';
//import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';

import {BroadbandAvailabilityPage} from './pages/broadband-availability/broadband-availability';
import {EfmAvailabilityPage} from './pages/efm-availability/efm-availability';
import {EthernetFttcPage} from './pages/ethernet-fttc/ethernet-fttc';
import {DomainAvailabilityPage} from './pages/domain-availability/domain-availability';
import {CasesPage} from './pages/cases/cases';
import {ServicesPage} from './pages/services/services';
import {NewCasePage} from './pages/new-case/new-case';
import {FeedbackPage} from './pages/feedback/feedback';
import {SettingsPage} from './pages/settings/settings';
import {ListPage} from './pages/list/list';
import {CommonService} from './providers/common-service/common-service';

import {DslamStatusPage} from './pages/dslam-status/dslam-status';
import {ChangeLineProfilePage} from './pages/change-line-profile/change-line-profile';



@Component({
  templateUrl: 'build/app.html'
})

export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  //rootPage: any = LoginPage;

  //rootPage: any = LoginPage;

  rootPage:any;

  //pages: Array<{title: string, section: string, component: any}>;

  pages:any;
  dialogOpened:boolean;
  constructor(
    private platform: Platform,
    private menu: MenuController,
    public alertCtrl: AlertController
  ) {
    this.initializeApp();
    this.pages =  [
                    {
                        "name":"Check Availability",
                        "id":"toggle1",
                        "Action":
                  				[
                            { title: 'ADSL & FTTC', component: BroadbandAvailabilityPage },
                            { title: 'EFM', component: EfmAvailabilityPage },
                            { title: 'Ethernet FTTC', component: EthernetFttcPage },
                            { title: 'Domain', component: DomainAvailabilityPage }
                  				]
                    },
                    {
                        "name":"Cases",
                        "id":"toggle2",
                        "Action":
                  				[
                            { title: 'Add New Case', component: NewCasePage },
                            { title: 'View Cases', component: CasesPage }
                  				]
                    },
                    {
                        "name":"Services",
                        "id":"toggle3",
                        "Action":
                  				[
                            { title: 'View Services', component: ServicesPage }
                  				]
                    },
                    {
                        "name":"Others",
                        "id":"toggle4",
                        "Action":
                  				[
                            { title: 'Leave Feedback/Feature request', component: FeedbackPage },
                            { title: 'Settings', component: SettingsPage }
                  				]
                    }
                ];

    this.dialogOpened = false;
    /*localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('MPin');*/

    // make rootPage based on Login Conditions
    let username = localStorage.getItem('username');
    let password = localStorage.getItem('password');
    let MPin = localStorage.getItem('MPin');
    //let DeviceToken = localStorage.getItem('DeviceToken');

    if(username != '' && username != null && password != '' && password != null && MPin != '' && MPin != null/* && DeviceToken != '' && DeviceToken != null*/)
    {
        this.rootPage = MPinPage;
    }
    else
    {
        this.rootPage = LoginPage;
    }

    //this.rootPage = LoginPage;

    //this.rootPage = ListPage;

  }

  /*hideSplashScreen() {
    if(navigator && navigator.splashscreen) {
    setTimeout(()=> {
    navigator.splashscreen.hide();
    }, 100);
    }
  }*/

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      /*let push = Push.init({
            android: {
                senderID: "234389417900"
            },
            ios: {
                alert: "true",
                badge: false,
                sound: "true"
            },
            windows: {}
      });

      push.on('notification', (data) => {
          console.log('message', data.message);

          let message = '';
          let page = '';
          let additionalData = data.additionalData;

          let CliNo = '';
          let gItemID = '';
          let DSLNetwork = '';
          let Supplier_ServiceID = '';
          let dslLineId = '';
          let ServiceID = '';

          if(additionalData)
          {
            Object.keys(additionalData).forEach(function (key) {
              if(key == 'actions')
              {
                let actions = additionalData['actions'];
                for (var action in actions) {
                  if(action == 'page')
                  {
                    page = actions[action];
                  }
                  if(page == 'change_line_profile') {


                    for (let field in actions[action]) {
                      if(field == 'CliNo') {
                        CliNo = actions[action][field];
                      }
                      if(field == 'ServiceID') {
                        ServiceID = actions[action][field];
                      }
                    }
                  }
                  if(page == 'reset_data_port') {

                    for (let field in actions[action]) {
                      if(field == 'CliNo') {
                        CliNo = actions[action][field];
                      }
                    }
                  }
                  if(page == 'dslam_status') {


                    for (let field in actions[action]) {
                      if(field == 'CliNo') {
                        CliNo = actions[action][field];
                      }
                      if(field == 'gItemID') {
                        gItemID = actions[action][field];
                      }
                      if(field == 'DSLNetwork') {
                        DSLNetwork = actions[action][field];
                      }
                      if(field == 'Supplier_ServiceID') {
                        Supplier_ServiceID = actions[action][field];
                      }
                      if(field == 'dslLineId') {
                        dslLineId = actions[action][field];
                      }
                    }
                  }
                }
              }
            })
          }

          //if user using app and push notification comes
          if (data.additionalData.foreground) {
              // if application open, show popup
              if(page == 'reset_data_port')
              {
                let confirmAlert = this.alertCtrl.create({
                    title: 'New Notification',
                    message: data.message,
                    buttons: ['OK']
                });
                confirmAlert.present();
              }
              else
              {
                let confirmAlert = this.alertCtrl.create({
                    title: 'New Notification',
                    message: data.message,
                    buttons: [{
                        text: 'Ignore',
                        role: 'cancel'
                    }, {
                        text: 'View',
                        handler: () => {
                            //TO DO: Your logic here
                            if(page == 'change_line_profile')
                            {
                              this.nav.push(ChangeLineProfilePage, {CliNo:CliNo, ServiceID:ServiceID});
                            }
                            else if(page == 'dslam_status')
                            {
                              this.nav.push(DslamStatusPage, {CliNo:CliNo, gItemID:gItemID, DSLNetwork:DSLNetwork, Supplier_ServiceID:Supplier_ServiceID, dslLineId:dslLineId});
                            }
                        }
                    }]
                });
                confirmAlert.present();
              }

          } else {
              //if user NOT using app and push notification comes
              //TO DO: Your logic on click of push notification directly
              //self.nav.push(SomeComponent, {message:data.message});
              console.log("Push notification clicked");
          }
      });
      push.on('error', (e) => {
          console.log(e.message);
      });*/



      StatusBar.styleDefault();
      Splashscreen.hide();
      //this.platform.registerBackButtonAction(function() { this.registerBackButtonListener(); });


      /*this.platform.registerBackButtonAction(() => {
        if (!this.nav.canGoBack()) {
          if(this.dialogOpened == false)
          {
            this.Logout('exit');
            return;
          }
        }
        else {
          this.nav.pop();
        }
      }, 501);*/


      /*document.addEventListener('backbutton', () => {
        if (!this.nav.canGoBack()) {
          this.Logout('exit');
        }
        else {
          this.nav.pop();
        }
      }, false);*/
    });

  }

  exitApp(){
     this.platform.exitApp();
  }

  /*registerBackButtonListener() {

    if (this.nav.canGoBack()) {
      this.nav.pop();
    }
    else {
      this.Logout(false);
    }

  }*/


  openPage(page) {
    // close the menu when clicking a link from the menu
    let navMenu = this.menu.close();

    // navigate to the new page if it is not the current page
    if(page.title == 'Change Pin')
    {
      //this.nav.push(page.component, {from:'app'});
      //navMenu.then(() => {
        this.nav.setRoot(page.component, {from:'app'});
      //});

    }
    else
    {
      //this.nav.push(page.component);
      //navMenu.then(() => {
        this.nav.setRoot(page.component);
      //});

    }
  }

  goHome() {
    this.menu.close();
    this.nav.setRoot(ListPage);
  }

  Logout(type) {

    //let nav = this.app.getComponent('nav');
    let titletext = '';
    let subtitle = '';

    this.menu.close();
    this.dialogOpened = true;

    if(type == 'exit')
    {
      titletext = 'Exit';
      subtitle = 'Are you sure you want to exit?';
    }
    else
    {
      titletext = 'Logout';
      subtitle = 'Are you sure you want to logout?';
    }

    let alert = this.alertCtrl.create({
      title: titletext,
      subTitle: subtitle,
      buttons: [
        {
          text:'Yes',
          handler : () => {
            this.dialogOpened = false;
            alert.dismiss();
            if(type == 'exit')
            {
              this.nav.setRoot(MPinPage);
              this.exitApp();
            }
            else if(type == 'logout')
            {
              localStorage.removeItem('username');
              localStorage.removeItem('password');
              localStorage.removeItem('MPin');
              this.nav.setRoot(LoginPage);
            }
          }
        },
        {
          text:'No',
          handler : () => {alert.dismiss(); this.dialogOpened = false;}
        }
      ]
    });

    alert.present();
  }
}

ionicBootstrap(MyApp, [CommonService], {
  //tabbarPlacement: 'bottom'
  // Below code is for ionic View only, In Real devices it works perfectly.
  platforms: {
      ios: {
        statusbarPadding: true
      }
    }
});
