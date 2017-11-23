import { Injectable } from '@angular/core';

// Importing HTTP symbols
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

// Special header in HTTP save request
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type':'application/json' })
};


@Injectable()
export class HeroService {

  // URL to web api, the address to heroes resource on the server 
  private heroesUrl = 'api/heroes';  
  
  // Injecting HttpClient into the constructor 
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  
   /** Log a HeroService message with the MessageService */
   private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
    
  /** GET heroes from the server */
  // Note: In general an Observable can return multiple valus over time.
  // However an Observable from HttpClient always emits a single value and then completes, never to emit again
  // This particular HttpClient.get call returns an Observable<Hero[]>, literally "an observable of hero arrays". 
  // In practice, it will only return a single hero array.
  getHeroes(): Observable<Hero[]> {

    // HttpClient.get returns the body of the response as an untyped JSON object by default. Applying the optional 
    // type specifier, <Hero[]> , gives you a typed result object.
    return this.http.get<Hero[]>(this.heroesUrl)

      // To hand errors, especially when getting data from a remote server
      // To catch errors, you "pipe" the observable result from http.get() through an RxJS catchError() operator. 
      .pipe(
        // The HeroService methods will tap into the flow of observable values and send a message (via log()) to the message area at 
        // the top of the page. They'll do that with the RxJS tap operator, which looks at the observable values, does something with those 
        // values, and passes them along. The tap call back doesn't touch the values themselves.
        tap(heroes => this.log(`fetched heroes`)),
        // The catchError() operator intercepts an Observable that failed. It passes the error an error handler 
        // that can do what it wants with the error.
        // The following handleError() method reports the error and then returns an innocuous result so that the
        // application keeps working. After reporting the error to console, the handler constructs a user friendly
        // message and returns a safe value to the app so it can keep working.
        // handError() requires has two arguments: 
        // 1. The Operation that failed
        // 2. Results, in this case return an empty string array 
        catchError(this.handleError('getHeroes', []))
       );
   }
  
  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        // Note: h is used as a reference for the outcome of the method
        // An _ can be used if no reference is required. In this case the outcome 
        // is stored based either as fetched (empty) / did not find (undefined)
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
   }
  
  /** GET hero by id. Will 404 if id not found */
  // Most web APIs support a get by id request in the form api/hero/:id (such as api/hero/11). 
  // Add a HeroService.getHero() method to make that request:
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
     );
   }
  
   /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
   }
  
  //////// Save methods //////////
  
  /** POST: add a new hero to the server */
  // HeroService.addHero() differs from updateHero in two ways.
  // it calls HttpClient.post() instead of put().
  // it expects the server to generates an id for the new hero, which it returns in the Observable<Hero> to the caller.
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
   }
  
  /** DELETE: delete the hero from the server */
  // Note that: 
  // it calls HttpClient.delete.
  // the URL is the heroes resource URL plus the id of the hero to delete
  // you don't send data as you did with put and post.
  // you still send the httpOptions.
  // There two possible input types either can be used to retrieve the Hero to be deleted
  deleteHero (hero: Hero | number): Observable<Hero> {
    
    // Checks if the hero is a number type 
    // true: Use hero as a number (i.e. The hero input is a number) 
    // false: Use hero.id as the input is a hero class (i.e. Use hero's property) 
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
   }
  
  /** PUT: update the hero on the server */
  // The HttpClient.put() method takes three parameters
  // 1. the URL
  // 2. the data to update (the modified hero in this case)
  // 3. options
  // The URL is unchanged. The heroes web API knows which hero to update by looking at the hero's id.
  // The heroes web API expects a special header in HTTP save requests. That header is in the httpOption 
  // constant defined in the HeroService.
  // The overall structure of the updateHero() method is similar to that of getHeroes(), but it uses http.put() 
  // to persist the changed hero on the server.
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
   }
  
   /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
   }
  

}


