import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, NavParams, MenuController, ViewController, AlertController, LoadingController, ModalController, ActionSheetController, PopoverController } from 'ionic-angular';
import {HTTP_PROVIDERS, Http} from '@angular/http';
import {CommonService} from '../../providers/common-service/common-service';
import {Toast} from 'ionic-native';
import {RadiusFullLogPage} from '../radius-full-log/radius-full-log';
import {ResetDataPortPage} from '../reset-data-port/reset-data-port';
import {DslamStatusPage} from '../dslam-status/dslam-status';
import {ChangeLineProfilePage} from '../change-line-profile/change-line-profile';
import {NewCasePage} from '../new-case/new-case';
import {MultiIpPingPage} from '../multi-ip-ping/multi-ip-ping';

/*
  Generated class for the ServiceDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  templateUrl: 'build/pages/service-detail/service-detail.html',
  providers: [HTTP_PROVIDERS, CommonService]
})
export class ServiceDetailPage {
  inventoryID:string;
  type:string;
  http:Http;
  results:any;
  loading:any;
  url:any;
  CliNo:any;
  gItemID:any;
  ParentChild:any;
  ParentChildAvailable:boolean;
  SupplierID:any;
	TailProviderID:any;
	OrderStage:any;
	DSLNetwork:any;
	Supplier_ServiceID:any;
	dslLineId:any;
  OrderLive:boolean;

  Manufacturer:any;
  Model:any;
  srno:any;
  name:any;
  nIPs:number;
  IPv4_subnet:any;
  IPv6_subnet:any;

  selectedItem: any;
  availabilityResult:boolean;
  /*@ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
  @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;*/

  constructor(private nav: NavController, private platform: Platform, private httpService: Http, private commonservice: CommonService, navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private actionsheetCtrl: ActionSheetController, private popoverCtrl: PopoverController) {

    this.inventoryID = navParams.get("ID");
    this.type = navParams.get("type");

    //this.selectedItem = true;

    this.http = httpService;
    this.nav = nav;
    this.commonservice = commonservice;
    this.results = [];
    this.availabilityResult = false;
    //this.platform = platform;
    this.platform.ready().then(() => {
      this.onSubmit();
    });
  }


  /*presentPopover(ev) {
    let popover = this.popoverCtrl.create(PopoverPage, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement,
      results:this.results,
      type:this.type
    });

    popover.present({ ev: ev });
  }*/

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
     this.loading.present();
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

      let clientID = sessionStorage.getItem("clientID");
      this.url = this.commonservice.APIUrl+'service_detail.php?clientID='+clientID+'&product_type='+this.type+'&InventoryID='+this.inventoryID;

      this.availabilityResult = false;
      this.presentLoading();


      this.http.get(this.url).subscribe((response) => {

        this.results = response.json();

        this.loading.dismiss();
         if(this.results.ret == true)
         {
            this.CliNo = this.results.DSLLineTelephone;

            this.availabilityResult = true;
            this.gItemID = this.results.gItemID;
            this.ParentChild = this.results.parent_child;
            if(this.ParentChild == '')
            {
              this.ParentChildAvailable = false;
            }
            else
            {
              this.ParentChildAvailable = true;
            }
            this.SupplierID = this.results.supplierID;
          	this.TailProviderID = this.results.tailproviderID;


          	this.OrderStage = this.results.orderStage;
            if(this.OrderStage.toLowerCase() != 'disconnected' && this.OrderStage.toLowerCase() != 'in notice period')
            {
              this.OrderLive = true;
            }
            else
            {
              this.OrderLive = false;
            }

          	this.DSLNetwork = this.results.DSLNetwork;
          	this.Supplier_ServiceID = this.results.Supplier_ServiceID;
          	this.dslLineId = this.results.dslLineId;

            // this is for new Case
            this.Manufacturer = this.results.manufacturer;
            this.Model = this.results.model;
            this.srno = this.results.tel_no;
            this.name = this.results.name;
            this.nIPs = this.results.nIPs;
            this.IPv4_subnet = this.results.ipv4_subnet;
            this.IPv6_subnet = this.results.ipv6_subnet;

         }
         else
         {
           let navLoading = this.loading.dismiss();
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



   pingIP() {
     if(this.nIPs > 1)
     {
       let pingModal = this.modalCtrl.create(MultiIpPingPage, { gItemID: this.gItemID });
       pingModal.onDidDismiss(data => {
        if(data.action == 'Select')
        {


        }
      });
       pingModal.present();
     }
     else
     {
       let arrIPv4 = this.IPv4_subnet.split("/");
       this.url = this.commonservice.APIUrl+'line_status_ping.php?type=ping&ping_ipaddress='+arrIPv4[0];
       this.presentLoading();
       this.http.get(this.url).subscribe((response) => {

         let IPresults = response.json();
         let navLoading = this.loading.dismiss();
          if(IPresults.ret == true)
          {
            navLoading.then(() => {
             this.presentError('Ping Result', IPresults.message);
            });
          }
          else
          {
            navLoading.then(() => {
             this.presentError('Error', IPresults.error);
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

   showDynamicIP() {
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
    this.url = this.commonservice.APIUrl+'show_dynamic_ip.php?dslLineId='+this.dslLineId;

    this.presentLoading();

    this.http.get(this.url).subscribe((response) => {

      let IPresults = response.json();
      let navLoading = this.loading.dismiss();
       if(IPresults.ret == true)
       {
         navLoading.then(() => {
          this.presentError('Last Dynamic IP Assigned', IPresults.message);
         });
       }
       else
       {
         navLoading.then(() => {
          this.presentError('Error', IPresults.error);
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

   gotoLog() {
     this.nav.push(RadiusFullLogPage, {CliNo:this.CliNo});
   }

   performActions(type)
   {

       let Flag_EditLineProfile = sessionStorage.getItem("Flag_EditLineProfile");

       switch(type)
       {
         case "raise_new_case":
            this.nav.push(NewCasePage, {inventoryID:this.inventoryID, Manufacturer:this.Manufacturer, Model:this.Model, name:this.name, srno:this.srno});
         break;
         case "full_log":
            if(this.CliNo == '')
            {
              this.presentError('Error', 'Radius Log not available for this connection.');
            }
            else
            {
              this.nav.push(RadiusFullLogPage, {CliNo:this.CliNo});
            }
        break;
        case "dslam_status":
               if(this.ParentChild == 'Child' && this.SupplierID == 'SR 0053')
               {
                 this.presentError('Error', 'You cannot get the statistics on a secondary line in an LLU bonded set.');
               }
               else if(this.OrderStage != 'Live')
               {
                 this.presentError('Error', 'You can only get line statistics on lines that are Live.');
               }
               else if(this.SupplierID != 'SR 0053' && this.TailProviderID != 'SR 0053' && this.TailProviderID != 'SR 0006' && this.TailProviderID != 'SR 0860')
               {
                 this.presentError('Error', 'DSLAM stats and line profiles are not available for this type of service.');
               }
               else if(this.TailProviderID == 'SR 0860' && (this.DSLNetwork != 'WBC' && this.DSLNetwork != 'FC'))
               {
                 this.presentError('Error', 'DSLAM stats and line profiles are not currently available for this type of service.');
               }
               else
               {

                    this.nav.push(DslamStatusPage, {CliNo:this.CliNo, gItemID:this.gItemID, DSLNetwork:this.DSLNetwork, Supplier_ServiceID:this.Supplier_ServiceID, dslLineId:this.dslLineId});

               }
         break;
         case "change_line_profile":

                if(Flag_EditLineProfile != 'Yes')
                {
                  this.presentError('Error', 'You do not have privileges to make this change.');
                }
                else if(this.Supplier_ServiceID == '')
                {
                  this.presentError('Error', 'Line profiles are not available for this type of service.');
                }
                else if(this.type != 'Connection' && this.TailProviderID != 'SR 0860')
                {
                  this.presentError('Error', 'Line profiles are not available for this type of service.');
                }
                else if(this.TailProviderID == 'SR 0860' && (this.DSLNetwork != 'WBC' && this.DSLNetwork != 'FC'))
                {
                  this.presentError('Error', 'Line profiles are not currently available for this type of service.');
                }
                else
                {
                  this.nav.push(ChangeLineProfilePage, {CliNo:this.CliNo, ServiceID:this.Supplier_ServiceID});
                }
          break;
          case "reset_data_port":

                if(Flag_EditLineProfile != 'Yes')
                {
                  this.presentError('Error', 'You do not have privileges to make this change.');
                }
                if(this.Supplier_ServiceID === '')
                {
                  this.presentError('Error', 'Reset Data Port not available for this type of service.');
                }
                if(this.type != 'Connection' && this.TailProviderID != 'SR 0860')
                {
                  this.presentError('Error', 'Reset Data Port not available for this type of service.');
                }
                if(this.TailProviderID == 'SR 0860' && (this.DSLNetwork != 'WBC' && this.DSLNetwork != 'FC'))
                {
                  this.presentError('Error', 'Reset Data Port currently not available for this type of service.');
                }
                else
                {
                  let confirm = this.alertCtrl.create({
                    title: 'Confirmation',
                    message: 'Are you sure you wish to reset the data port for this connection? This will temporarily disconnect the service.',
                    buttons: [
                      {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {

                          //let navTransition = confirm.dismiss();
                          new Promise((resolve, reject) => {
                              setTimeout(() => resolve(),600)
                          }).then(res => {
                          });

                        }
                      },
                      {
                        text: 'Yes',
                        handler: () => {
                          let navTransition = confirm.dismiss();
                          navTransition.then(() => {
                           this.nav.push(ResetDataPortPage, {CliNo:this.CliNo, ServiceID:this.Supplier_ServiceID, SID:this.TailProviderID});
                          });
                          /*new Promise((resolve, reject) => {
                              setTimeout(() => resolve(),600)
                          }).then(res => {
                            this.nav.push(ResetDataPortPage, {CliNo:this.CliNo, ServiceID:this.Supplier_ServiceID, SID:this.TailProviderID});
                          });*/
                        }
                      }
                    ]
                  });
                  confirm.present();
                }
           break;

       }
   }



   presentActionSheet() {
     if(this.type == 'Connection')
     {
          let actionSheet = this.actionsheetCtrl.create({
          title: 'Tasks',
          buttons: [
            /*{
              text: 'Destructive',
              role: 'destructive',
              handler: () => {
                console.log('Destructive clicked');
              }
            },*/
            {
              text: 'Show Radius Log',

              handler: () => {
                let navTransition = actionSheet.dismiss();
                navTransition.then(() => {
                  this.performActions('full_log');
                });
                return false;
                /*new Promise((resolve, reject) => {
                    setTimeout(() => resolve(),500)
                }).then(res => {
                  this.performActions('full_log');
                });*/

              }
            },{
              text: 'DSLAM Status',
              handler: () => {

                let navTransition = actionSheet.dismiss();
                navTransition.then(() => {
                  this.performActions('dslam_status');
                });
                return false;
                /*new Promise((resolve, reject) => {
                    setTimeout(() => resolve(),500)
                }).then(res => {
                  this.performActions('dslam_status');
                });*/

              }
            },{
              text: 'Change Line Profile',
              handler: () => {
                let navTransition = actionSheet.dismiss();
                navTransition.then(() => {
                  this.performActions('change_line_profile');
                });
                return false;
                /*new Promise((resolve, reject) => {
                    setTimeout(() => resolve(),500)
                }).then(res => {
                  this.performActions('change_line_profile');
                });*/

              }
            },{
              text: 'Reset Data Port',
              handler: () => {
                let navTransition = actionSheet.dismiss();
                navTransition.then(() => {
                  this.performActions('reset_data_port');
                });
                return false;
                /*new Promise((resolve, reject) => {
                    setTimeout(() => resolve(),500)
                }).then(res => {
                  this.performActions('reset_data_port');
                });*/

              }
            },{
              text: 'Raise a new case',
              handler: () => {
                let navTransition = actionSheet.dismiss();
                navTransition.then(() => {
                  this.performActions('raise_new_case');
                });
                return false;
                /*new Promise((resolve, reject) => {
                    setTimeout(() => resolve(),500)
                }).then(res => {
                  this.performActions('raise_new_case');
                });*/
              }
            }
          ]
        });
        actionSheet.present();

      }
      else
      {
        let actionSheet = this.actionsheetCtrl.create({
          title: 'Tasks',
          buttons: [
            {
              text: 'Raise a new case',
              handler: () => {
                let navTransition = actionSheet.dismiss();
                navTransition.then(() => {
                  this.performActions('raise_new_case');
                });
                return false;
                /*let navTransition = actionSheet.dismiss();
                new Promise((resolve, reject) => {
                    setTimeout(() => resolve(),500)
                }).then(res => {
                  this.performActions('raise_new_case');
                });
                return true;*/
              }
            }
          ]
        });
        actionSheet.present();
      }
  }
}

/*@Component({
  template: `
    <ion-list class="popover-page">
    <ion-item class="text-athelas">
      <ion-label (click)="close()">Close</ion-label>
    </ion-item>
    <ion-item class="text-iowan">
      <ion-label (click)="closeandnavigate('full_log')">Show Radius Log</ion-label>
    </ion-item>
    <ion-item class="text-charter">
      <ion-label (click)="closeandnavigate('dslam_status')">DSLAM Status</ion-label>
    </ion-item>
    <ion-item class="text-palatino">
      <ion-label (click)="closeandnavigate('change_line_profile')">Change Line Profile</ion-label>
    </ion-item>
    <ion-item class="text-san-francisco">
      <ion-label (click)="closeandnavigate('reset_data_port')">Reset Data Port</ion-label>
    </ion-item>
    <ion-item class="text-athelas">
      <ion-label (click)="closeandnavigate('raise_new_case')">Raise a new case</ion-label>
    </ion-item>
    </ion-list>
  `
})

class PopoverPage {

  contentEle: any;
  textEle: any;
  results:any;
  inventoryID:string;
  type:string;

  CliNo:any;
  gItemID:any;
  ParentChild:any;
  SupplierID:any;
	TailProviderID:any;
	OrderStage:any;
	DSLNetwork:any;
	Supplier_ServiceID:any;
	dslLineId:any;



  Manufacturer:any;
  Model:any;
  srno:any;
  name:any;


  constructor(private navParams: NavParams, private nav: NavController, private viewCtrl: ViewController, public alertCtrl: AlertController) {
     this.results = this.navParams.data.results;
     this.type = this.navParams.data.type;
     this.inventoryID = this.results.id;
     this.CliNo = this.results.DSLLineTelephone;
     this.gItemID = this.results.gItemID;
     this.ParentChild = this.results.parent_child;
     this.SupplierID = this.results.supplierID;
     this.TailProviderID = this.results.tailproviderID;


     this.OrderStage = this.results.orderStage;
     this.DSLNetwork = this.results.DSLNetwork;
     this.Supplier_ServiceID = this.results.Supplier_ServiceID;
     this.dslLineId = this.results.dslLineId;

     // this is for new Case
     this.Manufacturer = this.results.manufacturer;
     this.Model = this.results.model;
     this.srno = this.results.tel_no;
     this.name = this.results.name;
  }

  performActions(type)
  {
      let Flag_EditLineProfile = sessionStorage.getItem("Flag_EditLineProfile");

      switch(type)
      {
        case "raise_new_case":
           this.nav.push(NewCasePage, {inventoryID:this.inventoryID, Manufacturer:this.Manufacturer, Model:this.Model, name:this.name, srno:this.srno});
        break;
        case "full_log":
           if(this.CliNo == '')
           {
             this.presentError('Error', 'Radius Log not available for this connection.');
           }
           else
           {
             this.nav.push(RadiusFullLogPage, {CliNo:this.CliNo});
           }
       break;
       case "dslam_status":
              if(this.ParentChild == 'Child' && this.SupplierID == 'SR 0053')
              {
                this.presentError('Error', 'You cannot get the statistics on a secondary line in an LLU bonded set.');
              }
              else if(this.OrderStage != 'Live')
              {
                this.presentError('Error', 'You can only get line statistics on lines that are Live.');
              }
              else if(this.SupplierID != 'SR 0053' && this.TailProviderID != 'SR 0053' && this.TailProviderID != 'SR 0006' && this.TailProviderID != 'SR 0860')
              {
                this.presentError('Error', 'DSLAM stats and line profiles are not available for this type of service.');
              }
              else if(this.TailProviderID == 'SR 0860' && (this.DSLNetwork != 'WBC' && this.DSLNetwork != 'FC'))
              {
                this.presentError('Error', 'DSLAM stats and line profiles are not currently available for this type of service.');
              }
              else
              {
                 this.nav.push(DslamStatusPage, {CliNo:this.CliNo, gItemID:this.gItemID, DSLNetwork:this.DSLNetwork, Supplier_ServiceID:this.Supplier_ServiceID, dslLineId:this.dslLineId});
              }
        break;
        case "change_line_profile":

               if(Flag_EditLineProfile != 'Yes')
               {
                 this.presentError('Error', 'You do not have privileges to make this change.');
               }
               else if(this.Supplier_ServiceID == '')
               {
                 this.presentError('Error', 'Line profiles are not available for this type of service.');
               }
               else if(this.type != 'Connection' && this.TailProviderID != 'SR 0860')
               {
                 this.presentError('Error', 'Line profiles are not available for this type of service.');
               }
               else if(this.TailProviderID == 'SR 0860' && (this.DSLNetwork != 'WBC' && this.DSLNetwork != 'FC'))
               {
                 this.presentError('Error', 'Line profiles are not currently available for this type of service.');
               }
               else
               {
                 this.nav.push(ChangeLineProfilePage, {CliNo:this.CliNo, ServiceID:this.Supplier_ServiceID});
               }
         break;
         case "reset_data_port":

               if(Flag_EditLineProfile != 'Yes')
               {
                 this.presentError('Error', 'You do not have privileges to make this change.');
               }
               if(this.Supplier_ServiceID === '')
               {
                 this.presentError('Error', 'Reset Data Port not available for this type of service.');
               }
               if(this.type != 'Connection' && this.TailProviderID != 'SR 0860')
               {
                 this.presentError('Error', 'Reset Data Port not available for this type of service.');
               }
               if(this.TailProviderID == 'SR 0860' && (this.DSLNetwork != 'WBC' && this.DSLNetwork != 'FC'))
               {
                 this.presentError('Error', 'Reset Data Port currently not available for this type of service.');
               }
               else
               {
                 let confirm = this.alertCtrl.create({
                   title: 'Confirmation',
                   message: 'Are you sure you wish to reset the data port for this connection? This will temporarily disconnect the service.',
                   buttons: [
                     {
                       text: 'No',
                       role: 'cancel',
                       handler: () => {

                         let navTransition = confirm.dismiss();
                         new Promise((resolve, reject) => {
                             setTimeout(() => resolve(),600)
                         }).then(res => {
                         });

                       }
                     },
                     {
                       text: 'Yes',
                       handler: () => {
                         let navTransition = confirm.dismiss();
                         new Promise((resolve, reject) => {
                             setTimeout(() => resolve(),600)
                         }).then(res => {
                           this.nav.push(ResetDataPortPage, {CliNo:this.CliNo, ServiceID:this.Supplier_ServiceID, SID:this.TailProviderID});
                         });
                       }
                     }
                   ]
                 });
                 confirm.present();
               }
          break;
        default:
      }
  }

  presentError(title, msg) {

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: [
      {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          alert.dismiss();
        }
      }
    ]
    });
    alert.present();
  }

  closeandnavigate(type) {
    this.performActions(type);
  }

  ngOnInit() {
    if (this.navParams.data) {
      this.contentEle = this.navParams.data.contentEle;
      this.textEle = this.navParams.data.textEle;
    }
  }
}
*/
