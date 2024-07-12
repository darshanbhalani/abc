import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OverSpeedService {
  private apiUrl = 'http://localhost:5226/OverSpeed';

  constructor(private http: HttpClient) {}

  getAllIncidents(): Promise<any> {
    return this.http.get(`${this.apiUrl}/GetAllIncidents`).toPromise();
  }

  syncNewIncidents(lastExecutionTime: string): Promise<any> {
    return this.http.get(`${this.apiUrl}/SyncNewIncidents?lastExecutionTime=${lastExecutionTime}`).toPromise();
  }
}
