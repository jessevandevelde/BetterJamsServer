import { Component } from '@angular/core';
import { QueueRowComponent } from './components/queue-row/queue-row.component';
import dummyData from './components/queue-row/dummy-data.json';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<app-queue-row></app-queue-row>`,
  styleUrls: ['./app.component.css'],
  imports: [QueueRowComponent],
})
export class AppComponent {
  title = 'SpotifyBetterJams';
  dummyData = dummyData;
}
