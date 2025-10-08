import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';
import { SearchDropdownComponent } from '../dropdown/dropdown.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import type { Track } from 'src/app/types/track.interfaces';
import { Store } from '@ngrx/store';
import { SearchBarActions, SearchBarSelectors } from './store';

@Component({
  selector: 'btj-search-bar',
  imports: [FaIconComponent, SearchDropdownComponent, SearchResultComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  public tracks = input<Track[]>();
  public addSong = output<Track>();
  protected searchValueChange = output<string>();

  protected magnifyingGlass = faMagnifyingGlass;
  protected closeIcon = faX;
  protected showDropdown = false;

  private readonly searchBarService: SearchBarService;

  public constructor() {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    this.store = inject(Store);

    this.query = this.store.selectSignal(SearchBarSelectors.selectQuery);
  }

  protected search(event: Event): void {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
    const target = event.target as HTMLInputElement;

    this.searchValueChange.emit(target.value);

    /* eslint-disable-next-line no-console */
    console.log(target.value);
  }

  protected clearInput(): void {
    this.store.dispatch(SearchBarActions.resetSearchField());
  }

  protected toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
}
