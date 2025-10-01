import type { Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchBarService } from './search-bar.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { SearchBarActions, SearchBarSelectors } from './store';

@Component({
  selector: 'btj-search-bar',
  imports: [FaIconComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  protected magnifyingGlass = faMagnifyingGlass;
  protected closeIcon = faX;

  protected query: Signal<string>;
  private readonly searchBarService: SearchBarService;
  private readonly store: Store;
  public constructor() {
    this.searchBarService = inject(SearchBarService);
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    this.store = inject(Store);

    this.query = this.store.selectSignal(SearchBarSelectors.selectQuery);
  }

  protected searchTracks(query: string): void {
    if (query) {
      this.store.dispatch(SearchBarActions.searchTracks({ query }));
    }
    else {
      this.store.dispatch(SearchBarActions.resetSearchField());
    }
  }

  protected clearInput(): void {
    this.store.dispatch(SearchBarActions.resetSearchField());
  }
}
