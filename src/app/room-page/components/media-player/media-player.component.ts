import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Track } from '../../../types/track.interfaces';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";


@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent],
})
export class MediaPlayerComponent { 
  pause = faPause
  track = input.required<Track>();
}
