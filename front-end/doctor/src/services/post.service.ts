import {HttpClient,HttpErrorResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import { throwError } from "rxjs";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})


export class PostService {
  private _loginUrl = `${environment.API_URL}auth/jwt/create`;
  private _signUpUrl = `${environment.API_URL}auth/users/`;
  private _cityUrl = `${environment.API_URL}api/cities/`;
  private _forgotPassword = `${environment.API_URL}auth/forgot-password`;

    constructor(private httpClient: HttpClient,private router:Router){}

    forgotPassword(data: any){
      return this.httpClient.post<any>(this._forgotPassword, data)
    }

    getCities(stateId :any){
      return this.httpClient.post<any>(this._cityUrl, stateId)
    }


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
