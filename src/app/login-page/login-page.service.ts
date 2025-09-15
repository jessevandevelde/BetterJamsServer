import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {

  constructor(private http: HttpClient) { }

  login(){
   window.location.href = 'http://127.0.0.1:3000/login'
  }
}
