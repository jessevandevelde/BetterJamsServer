import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'btj-empty-queue',
  imports: [FaIconComponent],
  templateUrl: './empty-queue.component.html',
  styleUrl: './empty-queue.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyQueue {
  protected faMusic = faMusic;
}
