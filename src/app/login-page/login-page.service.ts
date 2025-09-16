import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class LoginPageService {
  public login(): void {
    window.location.href = 'http://127.0.0.1:3000/login';
  }
}
