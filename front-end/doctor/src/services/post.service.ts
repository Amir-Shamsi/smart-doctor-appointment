import {HttpClient,HttpErrorResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import { throwError } from "rxjs";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})


export class PostService {
  private _loginUrl = `${environment.API_URL}auth/jwt/create`; //'http://localhost:8000/auth/jwt/create';
  private _signUpUrl = `${environment.API_URL}auth/users/`; //'http://localhost:8000/auth/users/';

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
      this.router.navigate(['/'])
    }
  }
