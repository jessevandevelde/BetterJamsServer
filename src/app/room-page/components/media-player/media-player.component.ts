import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { Track } from '../../../types/track.interfaces';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, DatePipe],
})
export class MediaPlayerComponent { 
  pause = faPause
  track = input.required<Track>();
  progress = 0;
  private cd: ChangeDetectorRef;
  
  progressPercentage: number = 0;
  
  constructor() {
    this.cd = inject(ChangeDetectorRef);
    
    effect(() => {
      const track = this.track();
      const progress = this.progress // Needs to be replaced by signal input

      this.progressPercentage = this.getProgressPercentage(track.songDuration, progress);
    })

    setInterval(() => {
      const progress = this.progress >= this.track().songDuration 
        ? 0 
        : this.progress + 1000;
      
      this.progress = progress;
      this.progressPercentage = this.getProgressPercentage(this.track().songDuration, progress)

      this.cd.detectChanges();
    }, 1000)
  }

  private getProgressPercentage(songDuration: number, progress: number): number {
    this.progressPercentage = (progress / songDuration) * 100;
    return this.progressPercentage;
  }
}
