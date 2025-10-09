import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';
import { SearchDropdownComponent } from '../dropdown/dropdown.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import type { Track } from 'src/app/types/track.interfaces';

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
  public value = input<string>('');
  protected searchValueChange = output<string>();
  protected clearSearch = output();

  protected magnifyingGlass = faMagnifyingGlass;
  protected closeIcon = faX;
  protected showDropdown = false;

  protected search(event: Event): void {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
    const target = event.target as HTMLInputElement;

    this.searchValueChange.emit(target.value);

    /* eslint-disable-next-line no-console */
    console.log(target.value);
  }

  protected clearInput(): void {
    this.clearSearch.emit();
  }

  protected openDropdown(): void {
    this.showDropdown = true;
  }

  protected closeDropdown(): void {
    this.showDropdown = false;
  }
}
