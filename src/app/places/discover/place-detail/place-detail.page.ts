import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../booking/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/booking/booking.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place;
  isBookable = false;
  private placeSub: Subscription;

  constructor(
    private navCtrl: NavController, 
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService
    ) { }

  /*ngOnInit() {
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return ;
      }
      this.placeSub = this.placesService
        .getPlace(paramMap.get('placeId'))
          .subscribe( place => {
            this.place = place;
            this.isBookable = place.userId !== this.authService.userId;
      });
    });
  }*/

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(place => {
          console.log(place); //capire perchè non inserisce in this.place quello che riceve da place
          this.place = place;
          this.isBookable = place.userId !== this.authService.userId;
        });
    });
    
  }

  onBookPlace(){
    //this.navCtrl.navigateBack('/places/tabs/discover');
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
            this.loadingCtrl.create( {
              message: 'Prenotazione in corso...'
            }).then( loadingEl => {
                loadingEl.present();
                const data = resultdata.data.bookingData;
                if(resultdata.role === 'confirm'){
                  this.bookingService.addBooking(
                    this.place.id,
                    this.place.title,
                    this.place.imageUrl,
                    data.firstName,
                    data.lastName,
                    data.guestNumber,
                    data.startDate,
                    data.endDate
                  ).subscribe( () => {
                    loadingEl.dismiss();
                  });
                }
              });
      });
  }
    
  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
}


