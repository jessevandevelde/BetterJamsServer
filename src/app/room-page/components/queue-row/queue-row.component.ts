import { input, output } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { QueueTrack } from '../../../types/track.interfaces';
import { faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-queue-row',
  imports: [FontAwesomeModule, NgOptimizedImage],
  templateUrl: './queue-row.component.html',
  styleUrls: ['./queue-row.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueRowComponent {
  public track = input.required<QueueTrack>();
  public upVoteCount = input.required<number>();
  public upvoted = input.required<boolean>();
  protected fasThumbsUp = fasThumbsUp;
  protected faThumbsUp = faThumbsUp;
  protected vote = output();

  protected toggleVote(): void {
    this.vote.emit();
  }
}
