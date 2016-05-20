import {Page, NavController, MenuController, Loading, Alert} from 'ionic-angular';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';
import {CommonService} from '../../providers/common-service/common-service';

/*
  Generated class for the MPinPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/set-m-pin/set-m-pin.html',
  providers: [HTTP_PROVIDERS, CommonService]
})
export class SetMPinPage {

  public roundArr;
  public count;
  public pin1String:string;
  public pin2String:string;
  private pin0:boolean;
  private pin1:boolean;
  private pin2:boolean;
  private pin3:boolean;
  private pin4:boolean;
  private pin5:boolean;
  private pin6:boolean;
  private pin7:boolean;
  http:Http;
  results:any;
  constructor(public nav: NavController, private httpService: Http, private menu: MenuController, private commonservice: CommonService) {
    this.nav = nav;

    this.roundArr = [];
    this.count = 0;
    this.pin1String = '';
	   this.pin2String = '';
    this.pin0 = true;
    this.pin1 = true;
    this.pin2 = true;
    this.pin3 = true;
  	this.pin4 = true;
  	this.pin5 = true;
  	this.pin6 = true;
  	this.pin7 = true;
    this.http = httpService;
    this.commonservice = commonservice;
    this.results = [];
    this.menu.swipeEnable(false);
  }

  presentLoading() {
     let loading = Loading.create({
       content: "Please wait...",
       duration: 0,
       dismissOnPageChange: true
     });
     this.nav.present(loading);
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
      if(this.count < 8)
      {
        switch(this.count)
        {
          case 0:
            this.pin0 = false;
          break;
          case 1:
            this.pin1 = false;
          break;
          case 2:
            this.pin2 = false;
          break;
          case 3:
            this.pin3 = false;
          break;
    		  case 4:
            this.pin4 = false;
          break;
    		  case 5:
            this.pin5 = false;
          break;
    		  case 6:
            this.pin6 = false;
          break;
    		  case 7:
            this.pin7 = false;
          break;
        }
        this.roundArr.push(this.count);

    		if(this.count > 3)
    		{
    			this.pin2String += num;
    		}
    		else
    		{
          this.pin1String += num;
    		}
        this.count++;

        if(this.pin1String === this.pin2String)
        {
            let username = localStorage.getItem('username');
            let password = localStorage.getItem('password');

            this.presentLoading();

            this.http.get(this.commonservice.APIUrl+'check.php?action=login&pinact=save&username='+username+'&password='+password+'&pin='+this.pin1String)
            .subscribe((response) => {

            /*this.http.get('http://nc2.cerberusnetworks.co.uk/mobile/ionic/check.php?action=login&pinact=save&username='+username+'&password='+password+'&pin='+this.pin1String)
            .subscribe((response) => {*/
              this.nav.pop();
              this.results = response.json();


              if(this.results.ret == true)
              {
                localStorage.setItem('MPin', this.pin1String);

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
            () => console.log('Completed!')
          )
        }
        else if(this.count == 8)
        {
            this.presentError('Error', 'Pin do not match.');
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
        case 7:
          this.pin7 = true;
        break;
        case 6:
          this.pin6 = true;
        break;
        case 5:
          this.pin5 = true;
        break;
        case 4:
          this.pin4 = true;
        break;
		case 3:
          this.pin3 = true;
        break;
        case 2:
          this.pin2 = true;
        break;
        case 1:
          this.pin1 = true;
        break;
        case 0:
          this.pin0 = true;
        break;
      }
      this.roundArr.pop();
	  this.count--;
	  if(this.count < 4)
	  {
      	this.pin1String = this.pin1String.substring(0,this.pin1String.length-1);
	  }
	  else
	  {
	  	this.pin2String = this.pin2String.substring(0,this.pin2String.length-1);
	  }

    }
  }

  ClickClearButton()
  {
    this.pin0 = true;
    this.pin1 = true;
    this.pin2 = true;
    this.pin3 = true;
	this.pin4 = true;
	this.pin5 = true;
	this.pin6 = true;
	this.pin7 = true;
    this.roundArr = [];
    this.pin1String = '';
	this.pin2String = '';
    this.count = 0;
  }
}
