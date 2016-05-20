import {Page, NavController, MenuController, Loading, Alert} from 'ionic-angular';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';
import {LoginPage} from '../login/login';
import {Toast} from 'ionic-native';
import {CommonService} from '../../providers/common-service/common-service';

/*
  Generated class for the MPinPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/m-pin/m-pin.html',
  providers: [HTTP_PROVIDERS, CommonService]
})
export class MPinPage {

  public numberArr;
  public roundArr;
  public count;
  public numberString:string;
  private round0:boolean;
  private round1:boolean;
  private round2:boolean;
  private round3:boolean;
  http:Http;
  results:any;
  loading:any;

  constructor(public nav: NavController, private httpService: Http, private menu: MenuController, private commonservice: CommonService) {
    this.nav = nav;
    this.numberArr=[];
    this.roundArr = [];
    this.count = 0;
    this.numberString = '';
    this.round0 = true;
    this.round1 = true;
    this.round2 = true;
    this.round3 = true;
    this.http = httpService;
    this.commonservice = commonservice;
    this.results = [];
    this.menu.swipeEnable(false);
  }

  presentLoading() {
     this.loading = Loading.create({
       content: "Please wait...",
       duration: 0,
       dismissOnPageChange: true
     });
     this.nav.present(this.loading);
   }

   presentError(title, msg) {

     let alert = Alert.create({
       title: title,
       subTitle: msg,
       buttons: ['OK']
     });

     this.nav.present(alert);
   }

  ClickButton(num)
  {
    //this.numberArr.push(num);



      if(this.count < 4)
      {
        switch(this.count)
        {
          case 3:
            this.round3 = false;
          break;
          case 2:
            this.round2 = false;
          break;
          case 1:
            this.round1 = false;
          break;
          case 0:
            this.round0 = false;
          break;
        }
        this.roundArr.push(this.count);
        this.numberString += num;
        this.count++;

        if(this.numberString.length == 4)
        {

            let username = localStorage.getItem('username');
            let password = localStorage.getItem('password');

            /*if(!this.commonservice.ConnectionStatus())
            {
              console.log('No connection');
            }
            else
            {
              console.log(this.commonservice.networkState);
            }*/

            let connection = this.commonservice.CheckConnection();

            if(connection === false)
            {
              //this.presentError('Error', 'Please check your Network connection.');
              this.commonservice.createTimeout(300).then(() => {
                Toast.show("Please check your Network connection.", "3000", "bottom").subscribe(
                  toast => {
                    console.log(toast);
                  }
                );
              })              
              return false;
            }


            this.presentLoading();

            this.http.get(this.commonservice.APIUrl+'check.php?action=login&pinact=check&username='+username+'&password='+password+'&pin='+this.numberString)
            .subscribe((response) => {
            /*this.http.get('http://nc2.cerberusnetworks.co.uk/mobile/ionic/check.php?action=login&pinact=check&username='+username+'&password='+password+'&pin='+this.numberString)
            .subscribe((response) => {*/
              this.results = response.json();


              if(this.results.ret == true)
              {
                localStorage.setItem('MPin', this.numberString);

                sessionStorage.setItem("contactID", this.results.contactID);
                sessionStorage.setItem("clientID", this.results.clientID);
                sessionStorage.setItem("CompanyName", this.results.CompanyName);
                sessionStorage.setItem("FullName", this.results.FullName);
                sessionStorage.setItem("Flag_EditLineProfile", this.results.Flag_EditLineProfile);
                this.nav.setRoot(HelloIonicPage);
              }
              else
              {
              //  LoginPage.presentError('Authentication Failed!', 'Please try again.');
                this.presentError('Authentication Failed!', 'Please try again.');
                this.ClickClearButton();
              }
            },
            (error) => {
                this.presentError('Error', 'Unexpected error. Please try again.');
                this.ClickClearButton();
            },
            () => { this.loading.dismiss(); }
          )
        }
      }
  }

  ClickDeleteButton()
  {
    if(this.roundArr.length > 0)
    {
      var id = this.roundArr.length - 1;
      switch(id)
      {
        case 3:
          this.round3 = true;
        break;
        case 2:
          this.round2 = true;
        break;
        case 1:
          this.round1 = true;
        break;
        case 0:
          this.round0 = true;
        break;
      }
      this.count--;
      this.numberString = this.numberString.substring(0,id);
      this.roundArr.pop();
    }
  }

  ClickClearButton()
  {
    this.round0 = true;
    this.round1 = true;
    this.round2 = true;
    this.round3 = true;
    this.roundArr = [];
    this.numberString = '';
    this.count = 0;
  }
}
