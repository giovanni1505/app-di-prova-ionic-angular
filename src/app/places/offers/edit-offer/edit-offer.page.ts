import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Place } from '../../place.model';
import { NavController, LoadingController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  form: FormGroup;
  place: Place;
  placeId: string;
  isLoading = false;
  private placeSub: Subscription;
  

  constructor(
    private route: ActivatedRoute, 
    private navCtrl: NavController, 
    private placeService: PlacesService, 
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paraMap => {
      if(!paraMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paraMap.get('placeId');
      this.isLoading = true;
      this.placeSub = this.placeService
        .getPlace(paraMap.get('placeId'))
        .subscribe( place => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            })
          });
          this.isLoading = false;
        });
    });
  }

  onUpdateOffer(){
    if(!this.form.valid)
      return;
    this.loadingCtrl
    .create({
      message: 'Sto modificando...'
    })
    .then( loadingEl => {
      loadingEl.present();
      
      this.placeService
        .updatePlace(
          this.place.id, 
          this.form.value.title, 
          this.form.value.description
        )
        .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/places/tabs/offers']);
        });
    });  
  }

  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
}
