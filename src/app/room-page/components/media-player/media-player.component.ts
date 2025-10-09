import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
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
  public progress = input.required<number>();

  public isPlaying = input.required<boolean>();
  public track = input.required<Track>();
  protected pauseTrack = output();
  protected playTrack = output();

  protected faPause = faPause;
  protected faPlay = faPlay;

  protected readonly progressPercentage = signal(0);

  public constructor() {
    this.initializeProgressEffect();
  }

  protected togglePause(): void {
    this.isPlaying()
      ? this.pauseTrack.emit()
      : this.playTrack.emit();
  }

  private initializeProgressEffect(): void {
    effect(() => {
      this.progressPercentage.set(this.getProgressPercentage(this.track().durationMs, this.progress()));
    });
  }

  private getProgressPercentage(songDuration: number, progress: number): number {
    const oneHundredPercent = 100;

    return (progress / songDuration) * oneHundredPercent;
  }
}
