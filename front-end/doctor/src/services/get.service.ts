import {HttpClient,HttpErrorResponse, HttpHeaders} from '@angular/common/http'
import {Injectable} from '@angular/core'
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class GetService {
  private _stateUrl = `${environment.API_URL}api/provinces/`;
  private _healthUrl = `${environment.API_URL}api/insurance-companies`;
  private _qIntroUrl = `${environment.API_URL}disease/question-intro/`;
  private _symptomsUrl = `${environment.API_URL}disease/symptoms/`;

    constructor(private httpClient: HttpClient){}

    getStates(){
      return this.httpClient.get<any>(this._stateUrl)

    }

    getHealthInsuranceCompany(){
      return this.httpClient.get<any>(this._healthUrl)
    }

    getQuestionIntro(access: any){

      const httpHeaders = new HttpHeaders({

        'Authorization' : 'JWT '+ access,
      });
      return this.httpClient.get<any>(this._qIntroUrl, {headers: httpHeaders})
    }

    getSymptoms(access: any){
      const httpHeaders = new HttpHeaders({
        'Authorization' : 'JWT ' + access,
      });
      return this.httpClient.get<any>(this._symptomsUrl, {headers: httpHeaders});
    }
  }
