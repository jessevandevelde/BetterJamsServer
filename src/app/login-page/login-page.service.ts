import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {

  constructor(private http: HttpClient) { }

  login(){
    this.http.get('http://localhost:3000/login').subscribe(res => {
      console.log(res);
    });
  }
}
