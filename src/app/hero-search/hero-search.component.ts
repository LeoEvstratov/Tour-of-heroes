import {Component, OnInit} from '@angular/core';
import {HeroService} from "../hero.service";
import {Observable, Subject} from "rxjs";
import {Hero} from "../hero";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  constructor(private heroService: HeroService) {
  }

  heroes$: Observable<Hero[]> | undefined
  private searchTerms = new Subject<string>()

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

  search(term: string): void{
    this.searchTerms.next(term)
  }
}
