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
            'Roma',
            'https://www.wowtravel.it/wp-content/uploads/2018/07/upload474untitleddesign17.jpg',
            1

        ),
        new Booking 
        (
            'b2',
            'p2',
            'u2',
            'New York',
            'https://www.gelestatic.it/thimg/9bXeo3Ern-BE7ED-JQIsvY7N7YQ=/fit-in/960x540/https%3A//www.lastampa.it/image/contentid/policy%3A1.34132688%3A1560958259/WPNX-25661_ny-1024x436-kWj-U109572849492244-1024x576%40LaStampa.it.jpg%3Ff%3Ddetail_558%26h%3D720%26w%3D1280%26%24p%24f%24h%24w%3Dc7a0a65',
            34
        ),
        new Booking 
        (
            'b3',
            'p3',
            'u3',
            'Sidney',
            'https://lh3.googleusercontent.com/proxy/qAkuIcGfEbp-QbGaie8mkB1sh1hN3gtckh_9hlt2M0tR1C5UJkyxq_0nuG2jxEUa8tmUBsFG9zmjHxzn1Yka0XfxQoq0L4v1Ncn3b8k1nUbnJayn9JBlWD0',
            1
        )
    ]

    get bookings(){
        return [...this._bookings];
    }

        
}