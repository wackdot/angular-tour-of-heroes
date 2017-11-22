import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;

  constructor(
    // Holds information about the route to this instance of HeroDetailComponent
    private route: ActivatedRoute,
    // Gets the hero data from the remote server and will be used to get the hero-to-display
    private heroService: HeroService,
    // An Angular service for interacting with the browser. 
    // It will be used to navigate between views
    private location: Location
  ) { }

  // On initialisation of the component
  ngOnInit() {
    this.getHero();
  }

  getHero(): void {
    // route.snapshot: Static image of the route information shortly after the component was created
    // paramMap: Dictionary of route parameter values extracted from the URL
    // +: Converts a string to a number as route parameters are always string
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.heroService.updateHero(this.hero)
    .subscribe(() => this.goBack());
  }

}
