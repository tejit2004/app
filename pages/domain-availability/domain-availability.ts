import {Page, NavController, Alert, Loading,} from 'ionic-angular';
import { Component, Inject} from 'angular2/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {CommonService} from '../../providers/common-service/common-service';

/*
  Generated class for the DomainAvailabilityPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/domain-availability/domain-availability.html',
  directives: [FORM_DIRECTIVES],
  providers: [HTTP_PROVIDERS, CommonService]
})
export class DomainAvailabilityPage {
  domainForm: ControlGroup;
  domainName: AbstractControl;
  http:Http;
  results:any;
  loading:any;
  url:any;
  private validForm:boolean;
  private availabilityResult:boolean;
  constructor(fb: FormBuilder, private nav: NavController, private httpService: Http, private commonservice: CommonService) {
        this.domainForm = fb.group({
            'domainName': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10,11}')])]
        });

        this.domainName = this.domainForm.controls['domainName'];

        this.nav = nav;
        this.http = httpService;
        this.commonservice = commonservice;
        this.results = [];
        this.validForm = false;
        this.availabilityResult = false;
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

     onSubmit()
     {

         if(this.domainName.valid)
         {
           this.validForm = true;
           //this.url = 'http://nc2.cerberusnetworks.co.uk/mobile/ionic/broadband.php?type=cli&telephone='+this.telephone.value;
           this.url = this.commonservice.APIUrl+'check_efm_availability.php?type=telephone&telephone='+this.efm_telephone.value;
         }
         else if(!this.commonservice.CheckPostcode(this.efm_postcode.value))
         {
           Toast.show("Invalid Postcode.", "3000", "bottom").subscribe(
             toast => {
               console.log(toast);
             }
           );
           this.validForm = false;
           return false;
         }
         else
         {
            this.validForm = true;
            this.url = this.commonservice.APIUrl+'check_efm_availability.php?type=postcode&efm_postcode='+this.efm_postcode.value;
         }



         if(this.validForm) {

           this.EFMavailabilityResult = false;
           this.presentLoading();
           this.http.get(this.url).subscribe((response) => {


             this.results = response.json();

             //console.log(this.results);

             if(this.results.ret == true)
             {
                   this.EFMavailabilityResult = true;
             }
             else
             {
               //this.presentError('Authentication Failed!', 'Username or Password failed.');
               this.presentError('Error!', this.results.error);
             }
           },
           (error) => {
               //this.presentError('Error', 'Unexpected error. Please try again.');
               this.presentError('Error', 'Unexpected error. Please try again.');
           },
           () => { this.loading.dismiss(); }
         )}
     }

     EnableSearch()
     {
       this.EFMavailabilityResult = false;
     }
}
