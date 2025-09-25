import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchBarService } from './search-bar.service';

@Component({
  selector: 'btj-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  private readonly searchBarService: SearchBarService;

  public constructor() {
    this.searchBarService = inject(SearchBarService);
  }

  protected search(): void {
    const q = 'aint hard';

    this.searchBarService.search(q).subscribe();
  }
}
