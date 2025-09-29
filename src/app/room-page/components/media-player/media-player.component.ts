import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { Track } from '../../../types/track.interfaces';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DatePipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, DatePipe, NgOptimizedImage],
})

export class MediaPlayerComponent {
  public progress = input(0);
  public progressPercentage = input(0);
  public isPlaying = input.required<boolean>();
  public track = input.required<Track>();
  protected pauseTrack = output();
  protected playTrack = output();

  protected faPause = faPause;
  protected faPlay = faPlay;

  protected togglePause(): void {
    this.isPlaying()
      ? this.pauseTrack.emit()
      : this.playTrack.emit();
  }
}
