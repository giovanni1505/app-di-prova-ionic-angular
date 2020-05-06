import { Component, OnInit, OnDestroy } from '@angular/core';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  loadedOffers: Place[];
  private placesSub: Subscription;

  constructor(private placeService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.placesSub = this.placeService.places.subscribe( places => {
      this.loadedOffers = places;      
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    console.log(offerId);
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  ngOnDestroy(){
    if(this.placesSub){
      this.placesSub.unsubscribe();
    }
  }

}
