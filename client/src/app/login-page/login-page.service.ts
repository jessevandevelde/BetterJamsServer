import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class LoginPageService {
  public login(): void {
    window.location.href = '/api/login';
  }
}
