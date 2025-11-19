import { Overlay } from '@angular/cdk/overlay';
import { OverlayConfig } from '@angular/cdk/overlay';
import type { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, input, viewChild } from '@angular/core';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import type { SpotifyDevice } from 'src/app/types/devices.interface';
import { faDesktop, faMobileScreenButton, faHeadphones } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DeviceRow } from './components/device-row/device-row.component';

@Component({
  selector: 'btj-select-devices-modal',
  imports: [PortalModule, FaIconComponent, DeviceRow],
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

  private readonly overlay: Overlay;

  public constructor() {
    this.overlay = inject(Overlay);
  }

  public ngAfterViewInit(): void {
    this.openModal();
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
