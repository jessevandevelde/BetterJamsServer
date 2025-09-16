import { Component, inject } from '@angular/core';
import { LoginPageService } from './login-page.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [NgOptimizedImage],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],

})

export class LoginPageComponent {
  private readonly loginPageService: LoginPageService;

  public constructor() {
    this.loginPageService = inject(LoginPageService);
  }

  protected login(): void {
    this.loginPageService.login();
  }
}
