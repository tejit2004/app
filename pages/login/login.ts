import {IonicApp, Page, NavController, MenuController, Loading, Alert} from 'ionic-angular';
import {Toast} from 'ionic-native';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';
import { Component, Inject} from 'angular2/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {SetMPinPage} from '../set-m-pin/set-m-pin';
import {CommonService} from '../../providers/common-service/common-service';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/login/login.html',
  directives: [FORM_DIRECTIVES],
  providers: [HTTP_PROVIDERS, CommonService]
})
export class LoginPage {

  authForm: ControlGroup;
  username: AbstractControl;
  password: AbstractControl;
  http:Http;
  results:any;
  loading:any;

  constructor(fb: FormBuilder, private app: IonicApp, private menu: MenuController, private nav: NavController, private httpService: Http, private commonservice: CommonService) {
        this.authForm = fb.group({
            'username': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required])]
        });

        this.username = this.authForm.controls['username'];
        this.password = this.authForm.controls['password'];
        this.nav = nav;
        this.http = httpService;
        this.commonservice = commonservice;
        this.results = [];
        this.menu.swipeEnable(false);
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
     }


    onSubmit(value: string): void {
        if(this.authForm.valid) {

          this.presentLoading();
          this.http.get(this.commonservice.APIUrl+'check.php?action=login&username='+this.username.value+'&password='+this.password.value)
          .subscribe((response) => {
            this.loading.dismiss();
            this.results = response.json();
            if(this.results.ret == true)
            {
              localStorage.setItem('username', this.username.value);
							localStorage.setItem('password', this.password.value);

							sessionStorage.setItem("contactID", this.results.contactID);
							sessionStorage.setItem("clientID", this.results.clientID);
							sessionStorage.setItem("CompanyName", this.results.CompanyName);
							sessionStorage.setItem("FullName", this.results.FullName);
							sessionStorage.setItem("Flag_EditLineProfile", this.results.Flag_EditLineProfile);
              this.nav.setRoot(SetMPinPage);
            }
            else
            {
              this.presentError('Authentication Failed!', 'Username or Password failed.');
            }
          },
          (error) => {
              this.presentError('Error', 'Unexpected error. Please try again.');
          },
          () => console.log('Completed!')
        )}

    }

    checkFirstCharacterValidator(control: Control): { [s: string]: boolean } {
        if (control.value.match(/^\d/)) {
            return {checkFirstCharacterValidator: true};
        }
    }
}
