import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';

import { debounceTime, 
         distinctUntilChanged, 
         switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { debounce } from 'rxjs/operators/debounce';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }
  
  /* Push a search term into the observable stream 
  Every time the user types in the textbox, the binding calls 
  search() with the textbox value, a "search term". The searchTerms 
  becomes an Observable emitting a steady stream of search terms. */
  search(term: string): void {
    this.searchTerms.next(term);
  }

  /* Passing a new search term directly to the searchHeroes() after every user keystroke 
  would create an excessive amount of HTTP requests, taxing server resources and burning 
  through the cellular network data plan. Instead, the ngOnInit() method pipes the searchTerms 
  observable through a sequence of RxJS operators that reduce the number of calls to the searchHeroes(), 
  ultimately returning an observable of timely hero search results (each a Hero[]).
  */
  ngOnInit() {
    this.heroes$ = this.searchTerms.pipe(
      /* Wait 300ms waits until the flow of new string events pauses for 300 milliseconds 
      before passing along the latest string. You'll never make requests more frequently than 300ms. */
      debounceTime(300),

      // Ensures that a request is sent only if the filter text changed
      distinctUntilChanged(),

      /* With the switchMap operator, every qualifying key event can trigger an HttpClient.get() method call. 
      Even with a 300ms pause between requests, you could have multiple HTTP requests in flight and they may not 
      return in the order sent. switchMap() preserves the original request order while returning only the observable 
      from the most recent HTTP method call. Results from prior calls are canceled and discarded. Note: that canceling
      a previous searchHeroes() Observable doesn't actually abort a pending HTTP request. Unwanted results are simply 
      discarded before they reach your application code.
      
      Calls the search service for each search term that makes it through debounce and distinctUntilChanged. 
      It cancels and discards previous search observables, returning only the latest search service observable. */
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

}
