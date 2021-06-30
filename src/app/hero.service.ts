import {Injectable} from '@angular/core';
import {Hero} from "./hero";
import {Observable, of} from "rxjs";
import {MessageService} from "./message.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService) {
  }

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('Hero service fetched heroes')
    return this.httpClient.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  private log(message: string) {
    this.messageService.add(`Message service ${message}`)
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get <Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero ${id}`),
          catchError(this.handleError<Hero>(`getHero id: ${id}`))
        ));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  const: any // @ts-ignore
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  updateHero(hero: Hero | undefined): Observable<any> {
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.httpClient.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`add new hero ${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  delete(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`
    return this.httpClient.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero ${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([])
    const url = `${this.heroesUrl}/?name=${term}`;
    return this.httpClient.get<Hero[]>(url, this.httpOptions)
      .pipe(
        tap((term) => this.log(`searching ${term}`)),
        catchError(this.handleError<Hero[]>('search', []))
      );
  }
}
