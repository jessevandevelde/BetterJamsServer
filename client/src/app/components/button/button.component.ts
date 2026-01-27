import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  /* eslint-disable-next-line @angular-eslint/component-selector */
  selector: '[btjButton]',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {}
