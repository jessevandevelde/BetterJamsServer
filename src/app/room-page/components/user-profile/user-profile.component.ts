import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
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
  public userProfile = input.required<User>();
  public userProfileUrl = input.required<User>();
  protected showDropdown = signal(false);

  protected toggleDropdown(): void {
    this.showDropdown.set(!this.showDropdown());
  }

  protected openDropdown(): void {
    this.showDropdown.set(true);
  }

  protected closeDropdown(): void {
    this.showDropdown.set(false);
  }

  protected goToProfile(): void {
    const url = this.userProfile().accountUrl;

    if (url) {
      window.open(url, '_blank');
    }
  }
}
