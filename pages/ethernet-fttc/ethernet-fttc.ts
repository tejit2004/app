import {Page, NavController, Alert, Loading, Modal} from 'ionic-angular';
import { Component, Inject} from 'angular2/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import { GetAddressesPage} from '../get-addresses/get-addresses';
import {CommonService} from '../../providers/common-service/common-service';
import {Toast} from 'ionic-native';

/*
  Generated class for the EthernetFttcPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/ethernet-fttc/ethernet-fttc.html',
  directives: [FORM_DIRECTIVES],
  providers: [HTTP_PROVIDERS, CommonService]
})
export class EthernetFttcPage {
  EoFTTCForm: ControlGroup;
  telephone: AbstractControl;
  postcode: AbstractControl;
  http:Http;
  results:any;
  loading:any;
  url:any;
  private validForm:boolean;
  private availabilityResult:boolean;
  private AddressRefNum:string;
  private available:boolean;

  constructor(fb: FormBuilder, private nav: NavController, private httpService: Http, private commonservice: CommonService) {
        this.EoFTTCForm = fb.group({
            'telephone': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10,11}')])],
            'postcode': ['', Validators.compose([Validators.required])]
        });

        this.telephone = this.EoFTTCForm.controls['telephone'];
        this.postcode = this.EoFTTCForm.controls['postcode'];
        //this.postcode.value = this.postcodefield.toUpperCase()
        this.AddressRefNum = '';
        this.nav = nav;
        this.http = httpService;
        this.commonservice = commonservice;
        this.results = [];
        this.validForm = false;
        this.availabilityResult = false;
        this.available = false;
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

     presentAddressModal() {
       let addressModal = Modal.create(GetAddressesPage, { postcode: this.postcode.value });
       addressModal.onDismiss(data => {
        if(data.action == 'Select')
        {
          this.AddressRefNum = data.AddressRefNum;
          this.onSubmit();
        }
      });
       this.nav.present(addressModal);
     }


    onSubmit()
    {

        if(this.telephone.valid)
        {
          this.validForm = true;
          //this.url = 'http://nc2.cerberusnetworks.co.uk/mobile/ionic/broadband.php?type=cli&telephone='+this.telephone.value;
          this.url = this.commonservice.APIUrl+'eofttc_availability.php?type=telephone&telephone='+this.telephone.value;
        }
        else if(!this.commonservice.CheckPostcode(this.postcode.value))
        {
          setTimeout( ()=>{}, 500);
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
          if(this.AddressRefNum == '')
          {
            this.presentAddressModal();
          }
          else
          {
              this.validForm = true;
              //this.url = 'http://nc2.cerberusnetworks.co.uk/mobile/ionic/broadband.php?type=postcode&postcode='+this.postcode.value+'&addrRefNum='+this.AddressRefNum+'&DistrictCode='+this.DistrictCode;
              this.url = this.commonservice.APIUrl+'eofttc_availability.php?type=postcode&postcode='+this.postcode.value+'&addrRefNum='+this.AddressRefNum;
          }
            //console.log('here');
        }



        if(this.validForm) {

          this.availabilityResult = false;
          this.presentLoading();
          this.http.get(this.url).subscribe((response) => {


            this.results = response.json();

            if(this.results.ret == true)
            {
                  this.availabilityResult = true;
                  if(this.results.Availability.match(/Yes/g) != null && this.results.Availability.match(/Yes/g) != 'null')
                  {
                    this.available = true;
                  }
                  else
                  {
                    this.available = false;
                  }
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
      this.availabilityResult = false;
    }
}
