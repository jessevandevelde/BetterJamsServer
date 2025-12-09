import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'btj-empty-queue-placeholder',
  imports: [FaIconComponent],
  templateUrl: './empty-queue-placeholder.component.html',
  styleUrl: './empty-queue-placeholder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyQueuePlaceholder {
  protected faMusic = faMusic;
}
