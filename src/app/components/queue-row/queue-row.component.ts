import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import dummyData from './dummy-data.json';

@Component({
  selector: 'app-queue-row',
  standalone: true,
  imports: [],
  templateUrl: './queue-row.component.html',
  styleUrls: ['./queue-row.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['dummyData'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QueueRowComponent {
  dummyData = dummyData;
  upVoteCount = 0;
  ngOnInit() {
    console.log(this.dummyData);
  }
  
  onUpvote() {
    this.upVoteCount++;
  }
}
