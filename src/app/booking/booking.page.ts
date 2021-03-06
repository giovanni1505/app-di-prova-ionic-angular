import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit, OnDestroy {

  loadedBookings: Booking[];
  private bookingSub: Subscription;

  constructor(private bookingService: BookingService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe( bookings => {
      this.loadedBookings = bookings;
    })
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding){
    slidingItem.close();
    this.loadingCtrl.create(
      {message: 'Cancellazione...'}
    ).then( loadingEl => {
      loadingEl.present();
      this.bookingService
        .cancelBooking(bookingId) 
        .subscribe( () => {
          loadingEl.dismiss();
        });
    });   
  }

  ngOnDestroy(){
    if(this.bookingSub){
      this.bookingSub.unsubscribe();
    }
  }

}
