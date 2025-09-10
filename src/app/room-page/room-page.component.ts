import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-room-page',
  standalone: true,
  imports: [],
  template: `<p>room-page works!</p>`,
  styleUrl: './room-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomPageComponent { }
