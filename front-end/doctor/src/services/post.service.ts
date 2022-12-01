import {HttpClient,HttpErrorResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import { catchError, Observable, throwError } from "rxjs";
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

    forgotPassword(data: any): Observable<any> {
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

//     catchAuthError(error: any): Observable<Response>{
//       if(error && error.error && error.error.message){
//         alert(error.error.message)
//       }else if(error && error.message){
//         alert(error.message);
//       }else{
//         alert(JSON.stringify(error));
//       }
//       return throwError(error);
//   }
 }
