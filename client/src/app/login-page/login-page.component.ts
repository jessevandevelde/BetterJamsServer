import { Component, inject } from '@angular/core';
import { LoginPageService } from './login-page.service';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'btj-login-page',
  imports: [FontAwesomeModule],
  styleUrl: './login-page.component.css',
  templateUrl: './login-page.component.html',
})

export class LoginPageComponent {
  protected faSpotify = faSpotify;
  private readonly loginPageService: LoginPageService;

  public constructor() {
    this.loginPageService = inject(LoginPageService);
  }

  protected login(): void {
    this.loginPageService.login();
  }
}
