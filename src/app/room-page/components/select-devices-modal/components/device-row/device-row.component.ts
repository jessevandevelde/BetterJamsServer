import type { Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faDesktop, faHeadphones, faMobileScreenButton, faCheck } from '@fortawesome/free-solid-svg-icons';
import type { SpotifyDevice } from 'src/app/types/devices.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'btj-device-row',
  imports: [FaIconComponent],
  templateUrl: './device-row.component.html',
  styleUrl: './device-row.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceRow {
  public device = input.required<SpotifyDevice>();
  public isActive = input<boolean>(false);

  public selectDevice = output();
  protected checkIcon = faCheck;
  protected icon: Signal<IconDefinition>;

  public constructor() {
    this.icon = computed(() => {
      const device = this.device();

      switch (device.type) {
        case 'Computer':
          return faDesktop;
        case 'Smartphone':
          return faMobileScreenButton;
        default:
          return faHeadphones;
      }
    });
  }

  protected selectActiveDevice(): void {
    this.selectDevice.emit();
  }
}
