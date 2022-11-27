import {HttpClient,HttpErrorResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import { throwError } from "rxjs";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class PostService {
  private _loginUrl ='http://localhost:8000/auth/users/';
  private _signUpUrl ='http://localhost:8000/auth/jwt/create';
    constructor(private httpClient: HttpClient,private router:Router){}

    loginUser(user: any){
      return this.httpClient.post<any>(this._loginUrl, user)

    }
    errorhandler(error: HttpErrorResponse){
      return throwError(error)

    }
    signUpUser(user :any){
      return this.httpClient.post<any>(this._signUpUrl, user)
    }
    loggedin(){
      return !!localStorage.getItem('token')
    }
    logout(){
      localStorage.removeItem('token')
      this.router.navigate(['/dashboard'])
    }
  }
