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

  add(name: string): void {

    name = name.trim();
    if (!name) { return; }

    // When the given name is non-blank, the handler creates a Hero-like object from the name 
    // (it's only missing the id) and passes it to the services addHero() method.
    this.heroService.addHero({ name } as Hero)

    // When addHero saves successfully, the subscribe callback receives the new hero and pushes it 
    // into to the heroes list for display.
    .subscribe(hero => {
      this.heroes.push(hero);
    });
  }

    delete(hero: Hero): void {
      // Updates the heroes arrays by removing the input hero from the list
      // It assumes that HeroService woud succeed on the server
      this.heroes = this.heroes.filter(h => h !== hero);

      //There's really nothing for the component to do with the Observable returned by heroService.delete(). 
      // It must subscribe anyway.
      this.heroService.deleteHero(hero).subscribe();
    }
}