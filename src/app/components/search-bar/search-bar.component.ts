import type { ElementRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, input, output, viewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';
import { SearchDropdownComponent } from '../dropdown/dropdown.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import type { Track } from 'src/app/types/track.interfaces';
import { LoadingStateComponent } from '../loading-state/loading-state.component';

@Component({
  selector: 'btj-search-bar',
  imports: [FaIconComponent, SearchDropdownComponent, SearchResultComponent, LoadingStateComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  public tracks = input<Track[]>();
  public addSong = output<Track>();
  public value = input<string>('');
  public isLoading = input<boolean>();
  protected searchValueChange = output<string>();
  protected clearSearch = output();
  protected magnifyingGlass = faMagnifyingGlass;
  protected closeIcon = faX;
  protected showDropdown = false;
  private isFocused = false;

  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected search(event: Event): void {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
    const target = event.target as HTMLInputElement;

    this.searchValueChange.emit(target.value);
  }

  protected clearInput(): void {
    const searchInput = this.searchInput();

    if (searchInput) {
      searchInput.nativeElement.focus();
      this.clearSearch.emit();
    }
  }

  protected focus(): void {
    this.isFocused = true;
    this.showDropdown = true;
  }

  protected blur(): void {
    this.isFocused = false;
    this.showDropdown = false;
  }
}
