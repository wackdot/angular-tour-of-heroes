import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable()
export class HeroService {

  //The singleton MessageService will be injected when HeroService is created 
  constructor(private messageService: MessageService) { }


  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }

  // HttpClient method returns RxJS Observable 
  getHero(id: number): Observable<Hero> {
    // Todo: send the message _after_ fetching the heroes
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    // of is used to retrieve from the RxJS
    return of(HEROES.find(hero => hero.id === id));
  }

}
