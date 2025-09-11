import { Component, inject } from '@angular/core';
import { LoginPageService } from './login-page.service';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login-page',
  imports: [FontAwesomeModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],

})

export class LoginPageComponent {
  private loginPageService: LoginPageService

  protected faSpotify = faSpotify;

  constructor(){
    this.loginPageService = inject(LoginPageService)
  }

  protected login(){
    this.loginPageService.login()
  }
}
