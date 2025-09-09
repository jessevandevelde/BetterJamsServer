import { Component, inject } from '@angular/core';
import { LoginPageService } from './login-page.service';



@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',

})

export class LoginPageComponent {
  private loginPageService: LoginPageService

  constructor(){
    this.loginPageService = inject(LoginPageService)
  }

  protected login(){
    this.loginPageService.login()
  }
}
