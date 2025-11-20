import type { OverlayRef } from '@angular/cdk/overlay';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayConfig } from '@angular/cdk/overlay';
import type { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, input, output, signal, viewChild } from '@angular/core';
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
  public setActiveDeviceId = output<string>();

  protected selectedDeviceId = signal<string>('');

  private readonly overlay: Overlay;
  private overlayRef: OverlayRef | null = null;

  public constructor() {
    this.overlay = inject(Overlay);
  }

  public ngAfterViewInit(): void {
    this.openModal();
  }

  protected selectDevice(deviceId: string): void {
    this.selectedDeviceId.set(deviceId);
  }

  protected setActiveDevice(): void {
    const selectedDeviceId = this.selectedDeviceId();

    this.setActiveDeviceId.emit(selectedDeviceId);

    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  protected refreshWindow(): void {
    location.reload();
  }

  private openModal(): void {
    const config = new OverlayConfig({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      width: '60%',
    });

    this.overlayRef = this.overlay.create(config);

    this.overlayRef.attach(this.portal());
  }
}
