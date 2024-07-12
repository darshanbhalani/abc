import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rx';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  private readonly aqiUrl = 'https://localhost:7091/AQI/';
  private readonly overspeedUrl = 'https://localhost:7091/OverSpeed/';
  private readonly temperatureUrl = 'https://localhost:7091/Temperature/';

  constructor(private httpClient: HttpClient) { }

  getAQIConfigurations(): Observable<any> {
    return this.httpClient.get(`${this.aqiUrl}GetAllConfigurations`);
  }

  getOverspeedConfigurations(): Observable<any> {
    return this.httpClient.get(`${this.overspeedUrl}GetAllConfigurations`);
  }

  getTemperatureConfigurations(): Observable<any> {
    return this.httpClient.get(`${this.temperatureUrl}GetAllConfigurations`);
  }

  updateAQIConfiguration(postData: any): Observable<any> {
    return this.httpClient.post(`${this.aqiUrl}UpdateConfiguration`, postData);
  }

  updateOverspeedConfiguration(postData: any): Observable<any> {
    return this.httpClient.post(`${this.overspeedUrl}UpdateConfiguration`, postData);
  }

  updateTemperatureConfiguration(postData: any): Observable<any> {
    return this.httpClient.post(`${this.temperatureUrl}UpdateConfiguration`, postData);
  }

}