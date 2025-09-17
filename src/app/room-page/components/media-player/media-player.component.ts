import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import type { Track } from '../../../types/track.interfaces';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, DatePipe],
})

export class MediaPlayerComponent {
  public pause = faPause;
  public track = input.required<Track>();
  public progress = 0;
  public progressPercentage = 0;
  private readonly cd: ChangeDetectorRef;

  public constructor() {
    this.cd = inject(ChangeDetectorRef);

    effect(() => {
      const track = this.track();
      const { progress } = this; // Needs to be replaced by signal input

      this.progressPercentage = this.getProgressPercentage(track.songDuration, progress);
    });

    setInterval(() => {
      const oneSecondInMs = 1000;

      const progress = this.progress >= this.track().songDuration
        ? 0
        : this.progress + oneSecondInMs;

      this.progress = progress;
      this.progressPercentage = this.getProgressPercentage(this.track().songDuration, progress);

      this.cd.detectChanges();
    });
  }

  private getProgressPercentage(songDuration: number, progress: number): number {
    const oneHundredPercent = 100;

    this.progressPercentage = (progress / songDuration) * oneHundredPercent;

    return this.progressPercentage;
  }
}
