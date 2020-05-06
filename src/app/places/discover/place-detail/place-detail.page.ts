import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../booking/create-booking/create-booking.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place;
  private placeSub: Subscription;

  constructor(
    private navCtrl: NavController, 
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return ;
      }
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe( place => {
        this.place = place;
      });
    })
  }

  onBookPlace(){
    //this.navCtrl.navigateBack('/places/tabs/discover');
    console.log('sono dentro onBookPlace()');
    this.actionSheetCtrl.create({
      header: 'Scegli cosa fare',
      buttons:
        [
          {
            text: 'Select date',
            handler: () => {
              this.openBookingModal('select');
            }
          },
          {
            text: 'Random date',
            handler: () => {
              this.openBookingModal('random');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
    })
    .then( actionSheetEl => {
      actionSheetEl.present();
    });
  } 

  openBookingModal(mode: 'select' | 'random'){
    this.modalCtrl
        .create({
          component: CreateBookingComponent, 
          componentProps: { selectedPlace: this.place, selectedMode: mode }
        })
        .then(modalEl =>{
          modalEl.present();
          return modalEl.onDidDismiss();
        }).then(resultdata =>{
            console.log(resultdata);
        if(resultdata.role === 'confirm'){
         console.log('Prenotato!');
        }

      });
  }
    
  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
}


