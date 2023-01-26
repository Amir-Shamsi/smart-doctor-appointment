import {HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http'
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
  private _forgotPasswordUrl = `${environment.API_URL}auth/forgot-password`;
  private _analysisUrl = `${environment.API_URL}disease/analysis/`;
  private _sendMessageDoctorUrl = `${environment.API_URL}ticket/send-ticket/`;
  private _suggestDoctorsUrl = `${environment.API_URL}disease/get-doctors/`;
  private _bookDoctorUrl = `${environment.API_URL}disease/set-appointment/`;

    constructor(private httpClient: HttpClient,private router:Router){}
    suggestDoctor(data: any, access: any){
      const httpHeaders = new HttpHeaders({
        'Authorization' : 'JWT ' + access,
      });
      return this.httpClient.post<any>(this._suggestDoctorsUrl, data, {headers: httpHeaders});
    }

    bookDoctor(data: any, access: any){
      const httpHeaders = new HttpHeaders({
        'Authorization' : 'JWT ' + access,
      });
      return this.httpClient.post<any>(this._bookDoctorUrl, data, {headers: httpHeaders});
    }

    sendMessageDoctor(data: any, access: any){
      const httpHeaders = new HttpHeaders({
        'Authorization' : 'JWT ' + access,
      });
      return this.httpClient.post<any>(this._sendMessageDoctorUrl, data, {headers: httpHeaders});
    }

    sendMessage(data: any, access: any, id:any){
      const _sendMessageUrl = `http://localhost:8000/ticket/send-ticket/${id}/messages/`;
      const httpHeaders = new HttpHeaders({
        'Authorization' : 'JWT ' + access,
      });
      return this.httpClient.post<any>(_sendMessageUrl, data, {headers: httpHeaders});
    }

    postAnalysis(data: any, access: any){
      const httpHeaders = new HttpHeaders({
        'Authorization' : 'JWT ' + access,
      });
      return this.httpClient.post<any>(this._analysisUrl, data, {headers: httpHeaders});
    }

    forgotPassword(data: any): Observable<any> {
      return this.httpClient.post<any>(this._forgotPasswordUrl, data)
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

    loggedIn(){
      return !!localStorage.getItem('token')
    }

    logout(){
      localStorage.removeItem('token')
      this.router.navigate(['/'])
    }


 }
