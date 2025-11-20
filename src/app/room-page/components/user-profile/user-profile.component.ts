import { ChangeDetectionStrategy, Component, ElementRef, input, signal, ViewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import type { User } from 'src/app/types/user.interfaces';
import { DropdownComponent } from 'src/app/components/dropdown/dropdown.component';
import { ButtonComponent } from 'src/app/components/button/button.component';

@Component({
  selector: 'btj-user-profile',
  imports: [NgOptimizedImage, DropdownComponent, ButtonComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  @ViewChild('profile', { read: ElementRef }) public profile!: ElementRef<HTMLDivElement>;
  public userProfile = input.required<User>();
  protected showDropdown = signal(false);
  private outsideClickHandlerFn: null | ((event: Event) => void) = null;

  protected toggleDropdown(): void {
    this.showDropdown()
      ? this.closeDropdown()
      : this.openDropdown();
  }

  protected openDropdown(): void {
    this.showDropdown.set(true);
    this.setupOutsideClickHandler();
  }

  protected closeDropdown(): void {
    this.showDropdown.set(false);
    this.removeOutsideClickHandler();
  }

  private setupOutsideClickHandler(): void {
    this.outsideClickHandlerFn = (event: Event): void => {
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion */
      const target = event.target as HTMLDivElement;

      if (!this.profile.nativeElement.contains(target)) {
        this.closeDropdown();
      }
    };

    window.addEventListener('click', this.outsideClickHandlerFn);
  };

  private removeOutsideClickHandler(): void {
    if (this.outsideClickHandlerFn) {
      window.removeEventListener('click', this.outsideClickHandlerFn);
    }

    this.outsideClickHandlerFn = null;
  }
}
