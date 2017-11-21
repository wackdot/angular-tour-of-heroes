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

  // HttpClient method returns RxJS Observable 
  getHeroes(): Observable<Hero[]> {
    // Todo: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    // of is used to retrieve from the RxJS
    return of(HEROES);
  }

}
