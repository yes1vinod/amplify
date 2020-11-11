import { Component, OnInit } from '@angular/core';
import { APIService } from './API.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Restaurant } from '../types/restaurant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'amplify-app';
  public createForm: FormGroup;
  /* declare restaurants variable */
  restaurants: Array<Restaurant>;

  constructor(private api: APIService, private fb: FormBuilder) { }
  // tslint:disable-next-line:typedef
  async ngOnInit() {
    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'city': ['', Validators.required]
    });

    /* fetch restaurants when app loads */
    this.api.ListRestaurants().then(event => {
      this.restaurants = event.items;
    });

    /* subscribe to new restaurants being created */
    this.api.OnCreateRestaurantListener.subscribe((event: any) => {
      const newRestaurant = event.value.data.onCreateRestaurant;
      this.restaurants = [newRestaurant, ...this.restaurants];
    });
  }


  // tslint:disable-next-line:typedef
  public onCreate(restaurant: Restaurant) {
    this.api.CreateRestaurant(restaurant).then(event => {
      console.log('item created!');
      this.createForm.reset();
    })
      .catch(e => {
        console.log('error creating restaurant...', e);
      });
  }
}
