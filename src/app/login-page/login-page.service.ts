import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {

  constructor(private http: HttpClient) { }

  login(){
   window.location.href = 'http://localhost:3000/login'
  }
}
