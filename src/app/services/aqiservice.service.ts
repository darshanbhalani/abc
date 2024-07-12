import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AqiService {
  private apiUrl = 'http://localhost:5226/AQI';

  constructor(private http: HttpClient) {}

  getAllIncidents(): Promise<any> {
    return this.http.get(`${this.apiUrl}/GetAllIncidents`).toPromise();
  }

 
}
