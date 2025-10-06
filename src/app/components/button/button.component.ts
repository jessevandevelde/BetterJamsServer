import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'btj-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent { }
