import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from 'src/app/components/button/button.component';

@Component({
  selector: 'btj-search-result',
  imports: [ButtonComponent, NgOptimizedImage],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent { }
