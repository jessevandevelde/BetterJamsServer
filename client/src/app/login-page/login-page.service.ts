import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class LoginPageService {
  protected readonly apiCallLink = 'http://127.0.0.1:3000';

  public login(): void {
    window.location.href = `${this.apiCallLink}/api/login`;
  }
}
