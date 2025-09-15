import { input, output } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Track } from '../../../types/track.interfaces';
import { faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-queue-row',
  imports: [FontAwesomeModule],
  templateUrl: './queue-row.component.html',
  styleUrls: ['./queue-row.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueRowComponent {
  protected fasThumbsUp = fasThumbsUp;
  protected faThumbsUp = faThumbsUp;

  track = input.required<Track>();
  upVoteCount = input.required<number>();
  upvoted = input.required<boolean>();

  upvote = output<void>();
  removeVote = output<void>();

  toggleVote() {
    this.upvoted() 
      ? this.removeVote.emit() 
      : this.upvote.emit();
  }
}
