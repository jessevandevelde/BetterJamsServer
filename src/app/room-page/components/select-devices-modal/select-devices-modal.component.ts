import { Overlay } from '@angular/cdk/overlay';
import { OverlayConfig } from '@angular/cdk/overlay';
import type { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, input, signal, viewChild } from '@angular/core';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import type { SpotifyDevice } from 'src/app/types/devices.interface';
import { faDesktop, faMobileScreenButton, faHeadphones } from '@fortawesome/free-solid-svg-icons';
import { DeviceRow } from './components/device-row/device-row.component';
import { ButtonComponent } from 'src/app/components/button/button.component';

@Component({
  selector: 'btj-select-devices-modal',
  imports: [PortalModule, ButtonComponent, DeviceRow],
  templateUrl: 'select-devices-modal.component.html',
  styleUrl: './select-devices-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDevicesModal implements AfterViewInit {
  public devices = input.required<SpotifyDevice[]>();
  public readonly portal = viewChild(CdkPortal);

  public headPhoneIcon = faHeadphones;
  public mobileIcon = faMobileScreenButton;
  public desktopIcon = faDesktop;

  protected selectedDeviceId = signal<string>('');

  private readonly overlay: Overlay;

  public constructor() {
    this.overlay = inject(Overlay);
  }

  public ngAfterViewInit(): void {
    this.openModal();
  }

  protected selectDevice(deviceId: string): void {
    this.selectedDeviceId.set(deviceId);
  }

  private openModal(): void {
    const config = new OverlayConfig({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      width: '60%',
    });

    const overlayRef = this.overlay.create(config);

    overlayRef.attach(this.portal());
  }
}
