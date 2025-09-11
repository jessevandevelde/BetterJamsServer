import { CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QueueRowTrackData } from './queue-row.interfaces';


@Component({
  selector: 'app-queue-row',
  imports: [],
  templateUrl: './queue-row.component.html',
  styleUrls: ['./queue-row.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QueueRowComponent {
  track = input.required<QueueRowTrackData>()
  upVoteCount = 0;
  upvoted = false;

  onUpvote() {
    this.upvoted = !this.upvoted;
    this.upVoteCount += this.upvoted ? 1 : -1;
  }
}
