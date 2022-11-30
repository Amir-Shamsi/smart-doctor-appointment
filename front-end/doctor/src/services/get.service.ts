import {HttpClient,HttpErrorResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class GetService {
  private _stateUrl = `${environment.API_URL}auth/provinces/`; //'http://localhost:8000/auth/jwt/create';
  private _cityUrl = `${environment.API_URL}auth/cities/`; //'http://localhost:8000/auth/users/';

    constructor(private httpClient: HttpClient){}

    getStates(){
      return this.httpClient.get<any>(this._stateUrl)

    }

    getCities(stateId :any){
      return this.httpClient.post<any>(this._cityUrl, stateId)
    }
  }
