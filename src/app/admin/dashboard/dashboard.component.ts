import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Offer } from 'src/app/interfaces/offer';
import { OffersService } from 'src/app/services/offers.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})







export class DashboardComponent implements OnInit,OnDestroy{

 offerForm!:FormGroup ;
 offers:Offer[]=[];
 subscription!: Subscription
 currentOfferPhotoFile!:any
currentOfferPhotoUrl!:string





 constructor(
  private formBuilder: FormBuilder,
  private offerservice:OffersService,

)  {}

 initOfferForm(): void{
  this.offerForm=this.formBuilder.group({
    id:[null],
    title:['',Validators.required],
    photo:[],
    brand:'',
    model:'',
    description:'',
    prix:0

  });

}
ngOnInit(): void {
  this.initOfferForm();
 
//cas d'utiliseer le subject et non pas le observable
 this.subscription=this.offerservice.offersSubject.subscribe({
  next:(offers:Offer[]) => {
    console.log('NEXT')
    this.offers = offers
  },
  complete:()=>{
    console.log('observable complete')
  },
  error: (error)=>{
    console.error(error)
  }
});
this.offerservice.getOffers();
console.log(this.offerservice.offersSubject.value)
 /*
  //cas de observer peu faire l'appel plusieurs foid
  this.subscription=this.offerservice.getOffers().subscribe({
    next:(offers:Offer[]) => {
      console.log('NEXT')
      this.offers = offers
    },
    complete:()=>{
      console.log('observable complete')
    },
    error: (error)=>{
      console.error(error)
    }
    

  })*/

 
 // cas de promises
  
 /* this.offerservice.getOffers()
  .then((offers :Offer[])=>{
    this.offers=offers;
  }).catch((error)=>{
    console.error(error)
  }).finally(()=>{
    console.log('It s okay  ')
  })
  */
};
onSubmitOfferForm(): void{
  const offerId=this.offerForm.value.id
  let offer =this.offerForm.value;
  const offerPhotoUrl = this.offers.find(el=>el.id === offerId)?.photo;
  offer = {...offer,photo:offerPhotoUrl}
  console.log('OFFER INDEX ',offerId)
  if(!offerId || offerId == ''){// creation
    delete offer.id;
    this.offerservice.createOffer(offer,this.currentOfferPhotoFile).catch(console.error)
  }else { //modification
    delete offer.id;
    this.offerservice.editOffer(offer,offerId,this.currentOfferPhotoFile).catch(console.error)
  }
this.offerForm.reset();
this.currentOfferPhotoFile=null;
this.currentOfferPhotoUrl='null';


};




OnChangeOfferPhoto($event : any):void{
  this.currentOfferPhotoFile=$event.target.files[0]
  const fileReader = new FileReader();
  fileReader.readAsDataURL(this.currentOfferPhotoFile);
  fileReader.onloadend = (e)=>{
    this.currentOfferPhotoUrl= <string>e.target?.result;
  }
}


OnEditOffer(offer:Offer):void{
  this.currentOfferPhotoUrl= offer.photo ? offer.photo:'';
  this.offerForm.setValue({
    id:offer.id? offer.id:'',
    title:offer.title? offer.title:'',
    photo:'',
    brand:offer.brand? offer.brand:'',
    model:offer.model? offer.model:'',
    prix:offer.prix? offer.prix:'0',
    description:offer.description? offer.description:'',


  })
}
Onsupprime(offerId?:string) : void{
  if (offerId){
    this.offerservice.deleteOffer(offerId).catch(console.error);
  }else{
    console.error('an id must be provided to delete an offer')
  }
}

onSubmitOffrForm(form: NgForm): void{
  console.log(form.value);
}
//pour que la subscription ne se fait plusieurs fois
ngOnDestroy(): void {
  this.subscription.unsubscribe()
    
}


}


