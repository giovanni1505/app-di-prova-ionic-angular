import { Injectable } from "@angular/core";
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
    private _bookings = new BehaviorSubject<Booking[]>([]);

    constructor( private authService: AuthService){}

    get bookings(){
        return this._bookings.asObservable();
    }

    cancelBooking( bookingId: string){
        console.log('la prenotazione da cancellare è ' + bookingId);
        return this.bookings
            .pipe(
                take(1),
                delay(1000),
                tap( bookings => {
                    this._bookings.next(bookings.filter(b => b.id !== bookingId));
                })
            );
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImg: string,
        firstName: string,
        lastName: string,
        guest: number,
        dateFrom: Date,
        dateTo: Date
    ){
        const newBooking = new Booking(
            Math.random().toString(),
            placeId,
            this.authService.userId,
            placeTitle,
            placeImg,
            firstName,
            lastName,
            guest,
            dateFrom,
            dateTo
        );
        return this.bookings
            .pipe(
                take(1),
                delay(1000),
                tap( bookings => {
                    this._bookings.next(bookings.concat(newBooking));
                })
            );
    }
        
}