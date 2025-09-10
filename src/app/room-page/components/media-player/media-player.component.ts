import { ChangeDetectionStrategy, Component } from '@angular/core';
import dummyData from './dummydata.json';

@Component({
  selector: 'app-media-player',
  imports: [],
  standalone: true,
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['dummyData'],
})
export default class MediaPlayerComponent {
  dummyData = dummyData;
}
