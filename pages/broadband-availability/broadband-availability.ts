import {Page, NavController, Alert, Loading, Modal} from 'ionic-angular';
import { Component, Inject} from 'angular2/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators, AbstractControl } from 'angular2/common';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import { GetAddressesPage} from '../get-addresses/get-addresses';
import {CommonService} from '../../providers/common-service/common-service';
import {Toast} from 'ionic-native';

/*
  Generated class for the BroadbandAvailabilityPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/broadband-availability/broadband-availability.html',
  directives: [FORM_DIRECTIVES],
  providers: [HTTP_PROVIDERS, CommonService]
})

export class BroadbandAvailabilityPage {
  broadbandForm: ControlGroup;
  telephone: AbstractControl;
  postcode: AbstractControl;
  http:Http;
  results:any;
  loading:any;
  url:any;
  private validForm:boolean;
  private availabilityResult:boolean;
  private waitingList:boolean;
  private FTTCAvailable:boolean;
  private ADSLAvailable:boolean;
  private MPFAvailable:boolean;
  private Exchange:boolean;
  private AddressRefNum:string;
  private DistrictCode:string;


  constructor(fb: FormBuilder, private nav: NavController, private httpService: Http, private commonservice: CommonService) {
        this.broadbandForm = fb.group({
            'telephone': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10,11}')])],
            'postcode': ['', Validators.compose([Validators.required])]
        });

        this.telephone = this.broadbandForm.controls['telephone'];
        this.postcode = this.broadbandForm.controls['postcode'];
        //this.postcode.value = this.postcodefield.toUpperCase()

        this.nav = nav;
        this.http = httpService;
        this.commonservice = commonservice;
        this.results = [];
        this.validForm = false;
        this.availabilityResult = false;
        this.waitingList = false;
        this.FTTCAvailable = false;
        this.MPFAvailable = false;
        this.ADSLAvailable = false;
        this.Exchange = false;

        this.DistrictCode = '';
        this.AddressRefNum = '';
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
          this.DistrictCode = data.DistrictCode;
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
          this.url = this.commonservice.APIUrl+'broadband.php?type=cli&telephone='+this.telephone.value;
        }
        else if(!this.commonservice.CheckPostcode(this.postcode.value))
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
          if(this.DistrictCode == '')
          {
            this.presentAddressModal();
          }
          else
          {
              this.validForm = true;
              //this.url = 'http://nc2.cerberusnetworks.co.uk/mobile/ionic/broadband.php?type=postcode&postcode='+this.postcode.value+'&addrRefNum='+this.AddressRefNum+'&DistrictCode='+this.DistrictCode;
              this.url = this.commonservice.APIUrl+'broadband.php?type=postcode&postcode='+this.postcode.value+'&addrRefNum='+this.AddressRefNum+'&DistrictCode='+this.DistrictCode;
          }
            //console.log('here');
        }



        if(this.validForm) {

          this.availabilityResult = false;
          this.presentLoading();
          this.http.get(this.url).subscribe((response) => {


            this.results = response.json();
            this.DistrictCode = '';
            //console.log(this.results);

            if(this.results.ret == true)
            {
                  this.availabilityResult = true;
                  if(this.results.availability_flag == 'W')
                  {
                    this.waitingList = true;
                  }
                  if(this.results.WBC_availability.match(/Yes/g) != null && this.results.WBC_availability.match(/Yes/g) != 'null')
                  {
                    this.ADSLAvailable = true;
                    //console.log(this.ADSLAvailable);
                  }
                  if(this.results.LLU_FTTC_Availability.match(/Yes/g) != null && this.results.LLU_FTTC_Availability.match(/Yes/g) != 'null')
                  {
                    this.MPFAvailable = true;
                  }

                  if(this.results.FTTC_availability.match(/Yes/g)  != null && this.results.FTTC_availability.match(/Yes/g) != 'null')
                  {
                    this.FTTCAvailable = true;
                  }

                  if(this.results.FTTC_Exchange == 'P' || this.results.FTTC_Exchange == 'S')
                  {
                    this.Exchange = true;
                  }
            }
            else
            {
              //this.presentError('Authentication Failed!', 'Username or Password failed.');
              this.presentError('Error!', this.results.errMsg_BT);
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
