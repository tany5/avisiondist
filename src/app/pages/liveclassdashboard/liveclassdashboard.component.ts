import { Component, OnInit } from '@angular/core';
import { LiveclassdashboardService } from './liveclassdashboard.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EncrDecrServiceService } from 'src/app/encr-decr-service.service';

import { FormGroup,FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ICustomWindow,WindowRefService } from './window-ref.service';
import { NgZone } from '@angular/core';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
declare var jQuery: any;

@Component({
  selector: 'app-liveclassdashboard',
  templateUrl: './liveclassdashboard.component.html',
  styleUrls: ['./liveclassdashboard.component.scss']
})



export class LiveclassdashboardComponent implements OnInit {

  private _window: ICustomWindow;
  public rzp: any;
  productName: any ='';
  orderId: any='';
  public options: any = {
    key: 'rzp_test_5mL8vQ2aGPQyiN', // add razorpay key here
    name: this.productName,
    description: 'Avision Live Class-2020 ',
    amount: 100, // razorpay takes amount in paisa
    // prefill: {
    //   name: 'The Swag Coder',
    //   email: 'anirban.visiable@gmail.com', // add your email id
    // },
    notes: {},
    theme: {
      color: '#3880FF'
    },
    handler: this.paymentHandler.bind(this),
    modal: {
      ondismiss: (() => {
        this.zone.run(() => {
         
        })
      })
    }
  };

  customOptions2: OwlOptions = {
    autoplay: true,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 300,
    navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'],
    responsive: {
      0: {
        items: 1 
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };

  [x: string]: any;
  product_name: any;
  product_price: any
  product_offer_price: any
  liveDetails: any
  prodId: any
  urlEncryptId: any
  cupon_form: FormGroup;
  cupon_form_recomended : FormGroup
  buy_now_stat : any
  after_price: any
  cupon_stat:any
  cupon_code: any
  productOfferPrice:any
  productPrice:any
  practiceQuestion:any
  pdfNotes:any
  mockTest:any
  liveClasses:any
  liveClassTitle:any
  demoVideoUrl:any
  vdoId:any
  recommended_product:any
  paymentStatus:boolean=false


  constructor(private formbuilder: FormBuilder,private liveclassDashboardService: LiveclassdashboardService, private route: ActivatedRoute,private router: Router, private EncrDecr: EncrDecrServiceService,private location: Location,public santizer: DomSanitizer,private zone: NgZone,
    private winRef: WindowRefService) {

      this._window = this.winRef.nativeWindow;

      

    this.route.parent.params.subscribe(
      (params: Params) => {
        this.prodId = params['prodId']         
        this.urlEncryptId = this.prodId
        var decrypted = this.EncrDecr.get('123456$#@$^@1ERF', this.prodId)
        this.prodId = decrypted       
      })

      if(this.prodId == undefined) {
        this.route.params.subscribe(
          (params: Params) => {
            this.prodId = params['prodId']         
            this.urlEncryptId = this.prodId
            var decrypted = this.EncrDecr.get('123456$#@$^@1ERF', this.prodId)
            this.prodId = decrypted 
           
          })

          
      }

     
    this.liveclassDashboardService.getProductBrief(this.prodId).subscribe(

        (data) => {
          console.log("liveClssBrief..")
          console.log(data)
          this.vdoId = data['product_brief'][0]['youtube_url'].split('v=')[1]
         
          this.demoVideoUrl = this.santizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+this.vdoId);
          this.liveClassTitle = data['product_brief'][0]['live_class_title']
          this.liveClasses = data['product_brief'][0]['live_class']
          this.mockTest = data['product_brief'][0]['mock_test']
          this.pdfNotes = data['product_brief'][0]['pdf_notes']
          this.practiceQuestion = data['product_brief'][0]['practice_question']
          this.productPrice = data['product_brief'][0]['product_price']
          this.productOfferPrice = data['product_brief'][0]['product_offer_price']
        }
    )  
     this.liveclassDashboardService.getRecomndedProducts(this.prodId).subscribe(

        (data) => {
            console.log("recomended products...")
            console.log(data)
            this.recommended_product = data['product_brief']
            console.log(this.recommended_product)
        }
     )   
    this.liveclassDashboardService.getLiveClassDetails(this.prodId).subscribe(
      (res)=> {  
        console.log(res)     
        this.liveDetails = res['live_cls_dtls_data']       
        this.product_name = this.liveDetails['product_name']
        this.productName = this.product_name
        this.product_price = this.liveDetails['product_price']
        this.product_offer_price = this.liveDetails['product_offer_price']
     
      },
      (error)=> {
        console.log(error)
      })

      this.cupon_form = this.formbuilder.group({
        cupon: ['']
      });
      this.cupon_form_recomended = this.formbuilder.group({
        cupon: [''],
        prodid: ['']
      })

      
  }
  initPay(): void {
    
    this.rzp = new this.winRef.nativeWindow['Razorpay'](this.options);
    this.rzp.open();
    
  }
  paymentHandler(res: any,error:any) {
    //const hmacDigest = Base64.stringify(hmacSHA512(path + hashDigest, privateKey));
    console.log(res)
    if(res['razorpay_payment_id'] != 'undefined'){
      this.zone.run(() => {
        this.paymentStatus = true;
       this.router.navigate(['liveclass-dashboard/'+this.urlEncryptId+'/thankyou-live'])
      });
    }else{
      console.log(error)
    }
   
  }
  ngOnInit(): void {

    this.liveclassDashboardService.checkBuystatus(localStorage.getItem('currentUserId'),this.prodId).subscribe(

      (res) => {
        console.log(res);
        if(res['buy_stat'] == "1"){
          localStorage.setItem('buyNowStat','1');
          this.buy_now_stat = 1;
        }else{
          localStorage.setItem('buyNowStat','0');
          this.buy_now_stat =0;
        }
      }
    )

    jQuery(window).scroll(function() {    
      var scroll = jQuery(window).scrollTop();
  
       //>=, not <=
      if (scroll >= 100) {
        //clearHeader, not clearheader - caps H
        jQuery(".cus-sticky").addClass("sticky-fixed");
      }else {
        jQuery(".cus-sticky").removeClass("sticky-fixed");
      }
    });
  }
  onCuponSubmit(cupon_form1){
    this.cupon_code = cupon_form1.value.cupon
    this.liveclassDashboardService.checkCuponCode(cupon_form1.value.cupon,this.prodId,localStorage.getItem('currentUserId')).subscribe(

      (res) => {
        console.log(res);
        if(res['status'] == 200){
          localStorage.setItem('buyNowStat','1');
          this.after_price = res['product_price'];
          jQuery('#after_apply').show();
          jQuery('#unmatch').hide()
          this.cupon_stat = 200;
          //location.reload();
        }else if(res['status'] == 202){
          this.after_price = res['product_price'];
          jQuery('#after_apply').show();
          jQuery('#unmatch').hide()
          this.cupon_stat = 202;
         // var user_id = localStorage.getItem('currentUserId');
  	      //location.href = "http://estore.avision24x7.com/index.php/front/	front_ctr/pay_for_liveClass/"+user_id+"/"+this.prodId+'/1';
        }else{
          jQuery('#unmatch').show()
          localStorage.setItem('buyNowStat','0');
          this.cupon_stat=203;
        }
      }
    );
  }
  onCuponRecomendSubmit(cupon_form_recomended){
    this.cupon_code = cupon_form_recomended.value.cupon
    this.liveclassDashboardService.checkCuponCode(cupon_form_recomended.value.cupon,cupon_form_recomended.value.prodid,localStorage.getItem('currentUserId')).subscribe(

      (res) => {
        console.log(res);
        if(res['status'] == 200){
          localStorage.setItem('buyNowStat','1');
          this.after_price = res['product_price'];
          jQuery('#after_apply').show();
          jQuery('#unmatch').hide()
          this.cupon_stat = 200;
          //location.reload();
        }else if(res['status'] == 202){
          this.after_price = res['product_price'];
          jQuery('#after_apply').show();
          jQuery('#unmatch').hide()
          this.cupon_stat = 202;
         // var user_id = localStorage.getItem('currentUserId');
  	      //location.href = "http://estore.avision24x7.com/index.php/front/	front_ctr/pay_for_liveClass/"+user_id+"/"+this.prodId+'/1';
        }else{
          jQuery('#unmatch').show()
          localStorage.setItem('buyNowStat','0');
          this.cupon_stat=203;
        }
      }
    );
  }
  onLogout(){

    localStorage.clear();
    //this.location.back();
    //this.router.navigate(['../']);
    
    this.router.navigate(['liveclass'])
  }

  gotoPay(){

    var user_id = localStorage.getItem('currentUserId');
    // jQuery('#cupon_code_modal_form').modal('hide');
    //   jQuery('#cupon_code_recomended_modal_form').modal('hide');
    // this.rzp = new this.winRef.nativeWindow['Razorpay'](this.options);
    // this.rzp.open();
    
  	location.href = "https://estore.avision24x7.com/index.php/front/front_ctr/pay_for_liveClass/"+user_id+"/"+this.prodId+'/0/'+this.cupon_code;
  }

  onProcced(){
    var user_id = localStorage.getItem('currentUserId');
    if(this.cupon_stat == 200){
      location.reload();
    }else if(this.cupon_stat == 202){
      // jQuery('#cupon_code_modal_form').modal('hide');
      // jQuery('#cupon_code_recomended_modal_form').modal('hide');
      // this.rzp = new this.winRef.nativeWindow['Razorpay'](this.options);
      // this.rzp.open();
      location.href = "https://estore.avision24x7.com/index.php/front/front_ctr/pay_for_liveClass/"+user_id+"/"+this.prodId+'/1/'+this.cupon_code;
    }else{
      location.reload()
    }
  }

  recomId(product_id){
    jQuery('#prod_id').val(product_id)
  }

}
