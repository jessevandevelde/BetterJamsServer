import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'btj-search-dropdown',
  imports: [NgOptimizedImage],
  templateUrl: `../dropdown/dropdown.component.html`,
  styleUrl: '../dropdown/dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDropdownComponent { }
