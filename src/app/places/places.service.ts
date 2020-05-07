import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>( [
    new Place
     ( 
      'p1',
      'Roma',
      'Caput Mundi', 
      'https://www.wowtravel.it/wp-content/uploads/2018/07/upload474untitleddesign17.jpg',
      100,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'utente1'
      ),
    new Place 
    (
      'p2',
      'New York',
      'Very nice',
      'https://www.gelestatic.it/thimg/9bXeo3Ern-BE7ED-JQIsvY7N7YQ=/fit-in/960x540/https%3A//www.lastampa.it/image/contentid/policy%3A1.34132688%3A1560958259/WPNX-25661_ny-1024x436-kWj-U109572849492244-1024x576%40LaStampa.it.jpg%3Ff%3Ddetail_558%26h%3D720%26w%3D1280%26%24p%24f%24h%24w%3Dc7a0a65',
      0.50,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'utente2'
    ),
    new Place 
    (
      'p3',
      'San Pietroburgo',
      'Fondata nel 1703 da Pietro il Grande',
      'https://genovacultura.org/wp-content/uploads/2015/12/sanpietroburgo-600x321.jpg',
      1.23,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'utente3'
    ),
    new Place
    (
      'p4',
      'Sidney',
      'Nell altro emisfero ',
      'https://www.gelestatic.it/thimg/JK5iXUmfE1GcgUdBcL38G6UTpzw=/960x540/smart/https%3A//www.lanuovasardegna.it/image/contentid/policy%3A1.38253563%3A1577212528/sidney19573552.jpg%3Ff%3Ddetail_558%26h%3D720%26w%3D1280%26%24p%24f%24h%24w%3D6f87f59',
      666,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'utente4'
    ) 
  ]);

  constructor(private authService: AuthService) { }

  get places(){
    return this._places.asObservable();
  }

  getPlace(id: string){
    return this.places.pipe(
      take(1),
      map( places => {
        return {...places.find(p=> p.id === id)};
      })
    )
    
  }

  addPlace(title: string,
    description: string, 
    price: number, 
    availableFrom: Date, 
    availableTo: Date
    ){
      const newPlace = new Place(
        Math.random().toString(), 
        title, 
        description, 
        'https://genovacultura.org/wp-content/uploads/2015/12/sanpietroburgo-600x321.jpg',
        price,
        availableFrom,
        availableTo,
        this.authService.userId
      );
      // ritorno un observable in new offer per gestire la chiusura di loadingCtrl
      return this.places.pipe(
        take(1), 
        delay(1000), //ritardo per creare effetto caricamento
        tap( places => {
          this._places.next(places.concat(newPlace));
        })//utilizzo tap per far ritornare ad addPlace l'observable places, in questo modo posso utilizzare subscribe in new-offer.page.ts
      );
    }

  updatePlace(
    placeId: string,
    title: string,
    description: string
  ){
    return this.places
    .pipe(
      take(1),
      delay(1000),
      tap(places => {
        const updatedPlaceIndex = places.findIndex( pl => pl.id === placeId);
        const updatePlaces = [...places];
        const oldPlace = updatePlaces[updatedPlaceIndex];
        updatePlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatePlaces);
    }));
    
  }

}
