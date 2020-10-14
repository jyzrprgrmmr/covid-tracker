import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  apiUrl = "https://corona.lmao.ninja/v3/covid-19";

  constructor(
    private http: HttpClient
  ) { }


  getSummary(id):any{
      if(id == "worldwide"){
        return this.http.get(this.apiUrl + '/all');
      }
      else{
        return this.http.get(this.apiUrl + '/countries/' + id +'?strict=true');
      }
      
  }

  getAll():any{
    return this.http.get(this.apiUrl + '/countries?sort=cases');
  }

  getPastTenDaysAll():any{
    return this.http.get(this.apiUrl + '/historical/all?lastdays=10');
  }
  getPastTenDays(id):any{
    return this.http.get(this.apiUrl  + '/historical/'+ id + '?lastdays=10');
  } 
}
