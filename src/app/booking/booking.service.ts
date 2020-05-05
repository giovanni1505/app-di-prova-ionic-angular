import { Injectable } from "@angular/core";
import { Booking } from './booking.model';


@Injectable({ providedIn: 'root' })
export class BookingService {
    private _bookings: Booking[] = [
        new Booking 
        (
            'b1',
            'p1',
            'u1',
            'Vipiteno',
            'https://www.sudtirol.com/images/header/vipiteno.jpg',
            1

        ),
        new Booking 
        (
            'b2',
            'p2',
            'u2',
            'San Salvo',
            'https://static.spaghettiemandolino.it/img_prodotti/big/1980.jpg',
            34
        ),
        new Booking 
        (
            'b3',
            'p3',
            'u3',
            'Wuan',
            'https://cdn.mos.cms.futurecdn.net/JtVH5Khvihib7dBDFY9ZDR.jpg',
            1
        )
    ]

    get bookings(){
        return [...this._bookings];
    }

        
}