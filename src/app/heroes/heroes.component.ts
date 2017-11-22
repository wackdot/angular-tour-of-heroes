import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
 
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
   
  heroes: Hero[];
 
  // HeroService is injected into the component when it is created
  constructor(private heroService: HeroService) { }
 
  ngOnInit() {
    this.getHeroes();
  }
  
  getHeroes(): void {
    // Note: The corresponding method in hero.service returns an
    // Observable<Hero[]> asynchronously as it request is being fulfilled by
    // the remote server. Once the array has been received completely, subscribe passes
    // the emitted array to the callback which then sets the heroes property 
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }
}