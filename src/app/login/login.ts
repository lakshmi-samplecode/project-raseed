import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username:string=''
  password:string=''
  isLoading:boolean=false;
  constructor(private router:Router){}
  login(){
    this.isLoading=true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigateByUrl('/home')
    }, 1000);
  }
}
