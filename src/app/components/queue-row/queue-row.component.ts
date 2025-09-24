import { input, output } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { QueueRowTrackData } from './queue-row.interfaces';
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
  public readonly upvote = output();
  public readonly removeVote = output();
  public track = input.required<QueueRowTrackData>();
  public upVoteCount = input.required<number>();
  public upvoted = input.required<boolean>();
  protected fasThumbsUp = fasThumbsUp;
  protected faThumbsUp = faThumbsUp;

  protected toggleVote(): void {
    this.upvoted()
      ? this.removeVote.emit()
      : this.upvote.emit();
  }
}
