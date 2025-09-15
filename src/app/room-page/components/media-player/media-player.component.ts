import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Track } from '../../../types/track.interfaces';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaPlayerComponent { 
  track = input.required<Track>();
  
}
