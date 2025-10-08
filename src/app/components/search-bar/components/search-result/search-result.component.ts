import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // fontawesome import
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from 'src/app/components/button/button.component';
import type { Track } from 'src/app/types/track.interfaces';

@Component({
  selector: 'btj-search-result',
  imports: [ButtonComponent, NgOptimizedImage, FontAwesomeModule],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent {
  public track = input.required<Track>();
  protected addToQueueButton = faPlus;
}
