import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchBarService } from './search-bar.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';

;

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

  private readonly searchBarService: SearchBarService;
  public constructor() {
    this.searchBarService = inject(SearchBarService);
  }

  protected search(): void {
    const q = 'aint hard';

    this.searchBarService.search(q).subscribe();
  }

  protected clearInput(): void {
    const searchField = document.querySelector<HTMLInputElement>('.search-input');

    if (searchField !== null) {
      searchField.value = '';
    }
  }
}
