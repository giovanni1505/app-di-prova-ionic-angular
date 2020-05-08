import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

//creo interfaccia per i dati che ricevo dal get
interface PlaceData {
  availableFrom: string,
  availableTo: string,
  description: string,
  imageUrl: string,
  price: number,
  title: string,
  userId: string
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) { }

  get places(){
    return this._places.asObservable();
  }

  fetchPlaces(){
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://app-ionic-angular.firebaseio.com/offered-places.json') //key è l'identificatore dell'oggetto, PlaceData è il contenuto dell'oggetto
      .pipe(
          map( resData => {
            const places = [];
            for(const key in resData){
              if(resData.hasOwnProperty(key)){ //non necessario ma utile per verifica
                places.push(
                  new Place(
                    key,
                    resData[key].title,
                    resData[key].description,
                    resData[key].imageUrl,
                    resData[key].price,
                    new  Date(resData[key].availableFrom),
                    new  Date(resData[key].availableTo),
                    resData[key].userId
                  )
                );
              }
            }   
            return places;
          }),
          tap( places => {
            this._places.next(places);
          })
        );
  }

  getPlace(id: string){
    return this.http.get<PlaceData>(
            `https://app-ionic-angular.firebaseio.com/offered-places/${id}.json`
            )
            .pipe(
              map( placeData => {
                return new Place(
                  id,
                  placeData.title,
                  placeData.description,
                  placeData.imageUrl,
                  placeData.price,
                  new Date(placeData.availableFrom),
                  new Date(placeData.availableTo),
                  placeData.userId  
                )
              })
            );
  }

  addPlace(title: string,
    description: string, 
    price: number, 
    availableFrom: Date, 
    availableTo: Date
    ){
      let generatedId: string;
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
      return this.http
        .post<{name: string}>('https://app-ionic-angular.firebaseio.com/offered-places.json', {
          ...newPlace, id: null})
          .pipe(
            switchMap( resData => {
              generatedId = resData.name;
              console.log('questo è resData.name di switchMap: ' + resData.name);
              return this.places;
            }),
            take(1),
            tap( places => {
              newPlace.id = generatedId;
              this._places.next(places.concat(newPlace));
            }) 
          );


      // ritorno un observable in new offer per gestire la chiusura di loadingCtrl
      /* return this.places.pipe(
        take(1), 
        delay(1000), //ritardo per creare effetto caricamento
        tap( places => {
          this._places.next(places.concat(newPlace));
        })//utilizzo tap per far ritornare ad addPlace l'observable places, in questo modo posso utilizzare subscribe in new-offer.page.ts
      ); */
    }

  updatePlace(
    placeId: string,
    title: string,
    description: string
  ){
    let updatedPlaces: Place[];
    return this.places
      .pipe(
        take(1),
        switchMap( places => {
          const updatedPlaceIndex = places.findIndex( pl => pl.id === placeId);
          updatedPlaces = [...places];
          const oldPlace = updatedPlaces[updatedPlaceIndex];
          updatedPlaces[updatedPlaceIndex] = new Place(
            oldPlace.id,
            title,
            description,
            oldPlace.imageUrl,
            oldPlace.price,
            oldPlace.availableFrom,
            oldPlace.availableTo,
            oldPlace.userId
          );
          return this.http
            .put(
              `https://app-ionic-angular.firebaseio.com/offered-places/${placeId}.json`,
              {...updatedPlaces[updatedPlaceIndex], id: null}
            );
        }),
        tap( () => {
          this._places.next(updatedPlaces);
        })
        
      );
    
    /*return this.places
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
        
    }));*/
    
  }

}
