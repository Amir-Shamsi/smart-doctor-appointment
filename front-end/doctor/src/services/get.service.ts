import {HttpClient,HttpErrorResponse} from '@angular/common/http'
import {Injectable} from '@angular/core'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class GetService {
  private _stateUrl = `${environment.API_URL}api/provinces/`;
  private _healthUrl = `${environment.API_URL}api/insurance-companies`;

    constructor(private httpClient: HttpClient){}

    getStates(){
      return this.httpClient.get<any>(this._stateUrl)

    }

    getHealthInsuranceCompany(){
      return this.httpClient.get<any>(this._healthUrl)
    }
  }
