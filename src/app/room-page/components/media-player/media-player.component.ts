import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output } from '@angular/core';
import type { Track } from '../../../types/track.interfaces';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';

const ONE_SECOND_IN_MS = 1000;

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, DatePipe],
})

export class MediaPlayerComponent {
  public isPlaying = input.required<boolean>();
  public track = input.required<Track>();
  protected pauseTrack = output();
  protected playTrack = output();

  protected faPause = faPause;
  protected faPlay = faPlay;
  protected progress = 0;
  protected progressPercentage = 0;

  private readonly cd: ChangeDetectorRef;

  public constructor() {
    this.cd = inject(ChangeDetectorRef);

    effect(() => {
      const track = this.track();
      const { progress } = this; // Needs to be replaced by signal input

      this.progressPercentage = this.getProgressPercentage(track.songDuration, progress);
    });

    setInterval(() => {
      if (this.isPlaying()) {
        const progress = this.progress >= this.track().songDuration
          ? 0
          : this.progress + ONE_SECOND_IN_MS;

        this.progress = progress;
        this.progressPercentage = this.getProgressPercentage(this.track().songDuration, progress);
      }

      this.cd.detectChanges();
    }, ONE_SECOND_IN_MS);
  }

  protected togglePause(): void {
    this.isPlaying()
      ? this.pauseTrack.emit()
      : this.playTrack.emit();
  }

  private getProgressPercentage(songDuration: number, progress: number): number {
    const oneHundredPercent = 100;

    this.progressPercentage = (progress / songDuration) * oneHundredPercent;

    return this.progressPercentage;
  }
}
