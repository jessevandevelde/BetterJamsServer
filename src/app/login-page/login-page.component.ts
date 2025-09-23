import { Component, inject } from '@angular/core';
import { LoginPageService } from './login-page.service';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [FontAwesomeModule, NgOptimizedImage],
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
