import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Offer } from '../interfaces/offer';
@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private offers: Offer[] = [];

  constructor(
    private db :AngularFireDatabase,
    private storage:AngularFireStorage

  ){
    this.getoffersOn();
  }





  //behaviorSubject pour que l'objet soit lisible et renvoie les valeurs  au affichage du console
  offersSubject: BehaviorSubject<Offer[]> =new BehaviorSubject(<Offer[]>[]);
// si on veux travailler avec getOffers et subscribe on declare ce objet
  /*offersSubject: Subject<Offer[]> =new BehaviorSubject(<Offer[]>[]);*/


  //les promises avec getoffers

  /*getOffers():Promise<Offer[]>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        if (this.offers.length === 0){
          reject(new Error('No offer registred'))
        }
        resolve(this.offers);
      },3000)
    });
  }
  */
 // cas de observable subscribe et pour nos exemples nous travaillons avec subject
  /*getOffers(): Observable<Offer[]>{
    return new Observable(observer => {
      if (this.offers.length === 0){
        observer.error(new Error('No offer registred'));
      }
      setTimeout(()=>{
        observer.next(this.offers);
        observer.complete()
      },1000)

    })
  
  }
  */

  getOffers():void{
this.db.list('offers').query.limitToLast(10).once('value',snapshot=>{
  const offersSnapshotValue = snapshot.val()
  if(offersSnapshotValue){
    const offers= Object.keys(offersSnapshotValue).map(id=>({id, ...offersSnapshotValue[id]}))
    this.offers=offers
  }

  this.dispatchOffers()

})

  }

  getoffersOn():void{
    this.db.list('offers').query.limitToLast(10).on('value',snapshot=>{
      const offersSnapshotValue = snapshot.val()
      const offers = Object.keys(offersSnapshotValue).map(id=>({id, ...offersSnapshotValue[id]}))
      console.log(offers)
    })
  }



  // subject rxjs comme observale mais on peut ectracter la liste offers ou on veut
   dispatchOffers(){
    this.offersSubject.next(this.offers);
    console.log('dispatchOffers called');

   }
  async createOffer(offer:Offer,offerPhoto?:any):Promise<Offer>{
    try{
      
        const photoUrl= offerPhoto? await this.uploadPhoto(offerPhoto): ''; 
        const response = this.db.list('offers').push({...offer,photo:photoUrl});
        const createdOffer={...offer, photo:photoUrl,id:<string>response.key}
        this.offers.push(createdOffer)
        this.dispatchOffers()

           return createdOffer

    }catch(error){
      throw(error)

    }

  }

  async editOffer(offer:Offer,offerId:string,newOfferPhoto?: any):Promise<Offer>{
   try{
    if (newOfferPhoto && offer.photo && offer.photo !==''){
      await this.removePhoto(offer.photo);
    }
    if (newOfferPhoto){
      const newPhotoUrl = await this.uploadPhoto(newOfferPhoto)
      offer.photo = newPhotoUrl

    }
    await this.db.list('offers').update(offerId,offer);
    const offerIndexToUpdate= this.offers.findIndex(el=>el.id===offerId);
    this.offers[offerIndexToUpdate]={...offer, id:offerId};
    this.dispatchOffers();  
    return{...offer, id:offerId};
  }catch(error){
    throw error ;
  }

    
  }

  async deleteOffer(offerId:string):Promise<Offer>{
    try{
      const offerToDeleteIndex = this.offers.findIndex(el=>el.id === offerId);
      const offerToDelete=this.offers[offerToDeleteIndex]
     
      if(offerToDelete.photo && offerToDelete.photo !== ''){
        await this.removePhoto(offerToDelete.photo)
  
      }
      await this.db.list('offers').remove(offerId);
      this.offers.splice(offerToDeleteIndex, 1);
      this.dispatchOffers();
      return offerToDelete;
    }catch(error){
      throw error;  
    }

  }
  private uploadPhoto(photo:any):Promise<string>{
    return new Promise((resolve,reject)=>{
      const upload =this.storage.upload('offers/'+ Date.now()+'-' + photo.name,photo);
      upload.then((res)=>{
        resolve(res.ref.getDownloadURL())
      }).catch(reject);
    })
  }
  private removePhoto(photoUrl:string):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.storage.refFromURL(photoUrl).delete().subscribe({
        complete: ()=>resolve({}),
        error: reject
      });
    });
  }

}
