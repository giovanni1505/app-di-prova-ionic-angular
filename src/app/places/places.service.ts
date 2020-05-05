import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

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
      'utente'
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
      'utente'
    ),
    new Place 
    (
      'p3',
      'San Pietroburgo',
      'Fondata nel 1703 da Pietro il Grande',
      'https://lh3.googleusercontent.com/proxy/D4ctQUlBFVdIbhJ3QfgHkNGEwR-iepL50Wi4gHQc1MCax-6bknlX_jpTNCldxePhqmcxiLA-NC-81DvrTV6FX8uSAUR-uG34cNFCVLxvvGVv16PM2nm4KzVT9k0',
      1.23,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'utente'
    ),
    new Place
    (
      'p4',
      'Sidney',
      'Nell altro emisfero ',
      'https://lh3.googleusercontent.com/proxy/qAkuIcGfEbp-QbGaie8mkB1sh1hN3gtckh_9hlt2M0tR1C5UJkyxq_0nuG2jxEUa8tmUBsFG9zmjHxzn1Yka0XfxQoq0L4v1Ncn3b8k1nUbnJayn9JBlWD0',
      666,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'utente'
    ) 
  ]);

  constructor(private authService: AuthService) { }

  get places(){
    return this._places.asObservable();
  }

  getPlace(id: string){
    return {...this._places.find(p=> p.id === id)};
  }

  addPlaces(title: string,
    description: string, 
    price: number, 
    availableFrom: Date, 
    availableTo: Date
    ){
    console.log('questo è quello che arriva a addPlaces()' + title, description, price, availableFrom, availableTo);
    const newPlace = new Place(
      Math.random().toString(), 
      title, 
      description, 
      'https://lh3.googleusercontent.com/proxy/qAkuIcGfEbp-QbGaie8mkB1sh1hN3gtckh_9hlt2M0tR1C5UJkyxq_0nuG2jxEUa8tmUBsFG9zmjHxzn1Yka0XfxQoq0L4v1Ncn3b8k1nUbnJayn9JBlWD0',
      price,
      availableFrom,
      availableTo,
      this.authService.userId
    );
    //devo passare i dati all'observable
    
  }

}
