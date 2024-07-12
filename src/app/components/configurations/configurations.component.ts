import { Component, inject, OnInit, NgModule, ViewChild, ElementRef } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [GridModule, HttpClientModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css'
})
export class ConfigurationsComponent implements OnInit {
  configurationsList = [
    { configurationId: 1, configurationName: 'Overspeed', configurationThreshold: 80, configurationInterval: 5 },
    { configurationId: 2, configurationName: 'Temperature', configurationThreshold: 30, configurationInterval: 10 },
    { configurationId: 3, configurationName: 'AQI', configurationThreshold: 150, configurationInterval: 20 }
  ];



  modalTitle: string = '';
  id: number = 0;
  thresholdValue: number = 0;
  intervalTime: number = 0;

  // AQI Modal
  aqiForm!: FormGroup;
  parameters = ['PM10', 'PM2.5', 'NO2', 'SO2', 'CO', 'O3', 'NH3', 'Pb'];
  hours = [1, 8, 16, 24];
  categories = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe'];
  isAQIModal = false;
  isUpperBoundError = false;
  aqiConfigurations: any;
  overSpeedConfigurations: any;
  temperatureConfigurations: any;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private httpClient: HttpClient) {
    this.createAQIForm();
  }

  ngOnInit(): void {
    debugger;
    this.fetchAQIConfigurations();
    this.fetchOverspeedConfigurations();
    this.fetchTemperatureConfigurations();
  }
  ngAfterViewInit(): void {
    this.removeKendoInvalidLicense();
  }

  removeKendoInvalidLicense() {
    setTimeout(() => {
      const banner = Array.from(document.querySelectorAll('div')).find((el) =>
        el.textContent?.includes('No valid license found for Kendo UI for Angular')
      );
      if (banner) banner.remove();

      const watermarkElement = document.querySelector('div[kendowatermarkoverlay]');
      if (watermarkElement) {
        watermarkElement.remove();
        console.log('Watermark removed successfully.');
      } else {
        console.log('Watermark element not found.');
      }
    }, 0);
  }


  fetchAQIConfigurations() {
    this.httpClient.get('http://localhost:5226/AQI/GetAllConfigurations').subscribe((response: any) => {
      this.aqiConfigurations = response.body;
      console.log(this.aqiConfigurations);
    });
  }

  fetchOverspeedConfigurations() {
    this.httpClient.get('http://localhost:5226/OverSpeed/GetAllConfigurations').subscribe((response: any) => {
      this.overSpeedConfigurations = response.body;
      console.log(this.overSpeedConfigurations);
    });
  }

  fetchTemperatureConfigurations() {
    this.httpClient.get('http://localhost:5226/Temperature/GetAllConfigurations').subscribe((response: any) => {
      this.temperatureConfigurations = response.body;
      console.log(this.temperatureConfigurations);
    });
  }

  openModal(event: Event, content: any, data: any) {
    event.preventDefault();
    this.id = data.configurationId;
    this.modalTitle = data.configurationName;

    if (data.configurationName.toLowerCase().includes('aqi')) {
      this.isAQIModal = true;
      this.resetAQIForm();
      this.populateAQIForm(this.aqiForm.get('parameter')?.value);
    } else if (data.configurationName.toLowerCase().includes('temperature')) {
      this.isAQIModal = false;
      this.populateTemperatureForm(data);
    } else if (data.configurationName.toLowerCase().includes('overspeed')) {
      this.isAQIModal = false;
      this.populateOverspeedForm(data);
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' });
  }

  saveChanges(): void {
    if (this.isAQIModal && this.hasUpperBoundError()) {
      this.isUpperBoundError = true;
      return;
    }
    this.isUpperBoundError = false;
    const postData = {
      configurationId: this.id,
      configurationName: this.modalTitle,
      configurationThreshold: this.thresholdValue,
      configurationInterval: this.intervalTime,
      AQIValues: this.aqiForm.value
    };
    console.log('Saving changes:', postData);

    this.modalService.dismissAll();

    // Determine the configuration type and send the data accordingly
    if (this.modalTitle.toLowerCase().includes('aqi')) {
      this.saveAQIData(postData);
    } else if (this.modalTitle.toLowerCase().includes('temperature')) {
      this.saveTemperatureData(postData);
    } else if (this.modalTitle.toLowerCase().includes('overspeed')) {
      this.saveOverspeedData(postData);
    }
  }

  saveAQIData(postData: any): void {
    this.httpClient.post('http://localhost:5226/AQI/UpdateConfiguration', postData)
      .subscribe((response: any) => {
        console.log('Response from AQI API:', response);
      }, (error: any) => {
        console.error('Error from AQI API:', error);
      });
  }

  saveTemperatureData(postData: any): void {
    this.httpClient.post('http://localhost:5226/Temperature/UpdateConfiguration', postData)
      .subscribe((response: any) => {
        console.log('Response from Temperature API:', response);
        this.fetchTemperatureConfigurations(); // Refresh data
        this.modalService.dismissAll();
      }, (error: any) => {
        console.error('Error from Temperature API:', error);
      });
  }

  saveOverspeedData(postData: any): void {
    this.httpClient.post('http://localhost:5226/OverSpeed/UpdateConfiguration', postData)
      .subscribe((response: any) => {
        console.log('Response from Overspeed API:', response);
        this.fetchOverspeedConfigurations(); // Refresh data
        this.modalService.dismissAll();
      }, (error: any) => {
        console.error('Error from Overspeed API:', error);
      });
  }



  createAQIForm() {
    this.aqiForm = this.fb.group({
      parameter: [this.parameters[0], Validators.required],
      duration: [this.hours[0], Validators.required],
      goodLower: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      goodUpper: ['', [Validators.required, Validators.min(0)]],
      satisfactoryLower: ['', [Validators.required, Validators.min(0)]],
      satisfactoryUpper: ['', [Validators.required, Validators.min(0)]],
      moderateLower: ['', [Validators.required, Validators.min(0)]],
      moderateUpper: ['', [Validators.required, Validators.min(0)]],
      poorLower: ['', [Validators.required, Validators.min(0)]],
      poorUpper: ['', [Validators.required, Validators.min(0)]],
      verypoorLower: ['', [Validators.required, Validators.min(0)]],
      verypoorUpper: ['', [Validators.required, Validators.min(0)]],
      severeLower: ['', [Validators.required, Validators.min(0)]],
      severeUpper: [{ value: 10000, disabled: true }, [Validators.required, Validators.min(0)]]
    });

    this.setupValueChanges();
  }

  resetAQIForm() {
    this.aqiForm.reset({
      parameter: this.parameters[0],
      duration: this.hours[0],
      goodLower: { value: 0, disabled: true },
      // goodUpper: '',
      // satisfactoryLower: '',
      // satisfactoryUpper: '',
      // moderateLower: '',
      // moderateUpper: '',
      // poorLower: '',
      // poorUpper: '',
      // verypoorLower: '',
      // verypoorUpper: '',
      // severeLower: '',
      severeUpper: { value: 10000, disabled: true }
    });
    this.populateAQIForm(this.parameters[0]);
  }

  setupValueChanges() {
    this.aqiForm.get('parameter')?.valueChanges.subscribe((selectedParameter: any) => {
      this.populateAQIForm(selectedParameter);
      // this.populateAQIForm(this.parameters[0]);
    });

    // this.categories.forEach((category, index) => {
    //   const lowerControl = this.aqiForm.get(`${category.toLowerCase().replace(' ', '')}Lower`);
    //   const upperControl = this.aqiForm.get(`${category.toLowerCase().replace(' ', '')}Upper`);

    //   lowerControl?.valueChanges.subscribe((value: any) => {
    //     this.updateAdjacentBounds(index, 'lower', value);
    //   });

    //   upperControl?.valueChanges.subscribe((value: any) => {
    //     this.updateAdjacentBounds(index, 'upper', value);
    //   });
    // });
  }

  updateAdjacentBounds(index: number, type: string, value: number): void {
    const precisionValue = Number(value.toFixed(1));

    if (type === 'lower') {
      if (index > 0) {
        const prevUpperControl = this.aqiForm.get(`${this.categories[index - 1].toLowerCase().replace(' ', '')}Upper`);
        prevUpperControl?.setValue(precisionValue - 0.1, { emitEvent: false });
      }
    } else if (type === 'upper') {
      if (index < this.categories.length - 1) {
        const nextLowerControl = this.aqiForm.get(`${this.categories[index + 1].toLowerCase().replace(' ', '')}Lower`);
        nextLowerControl?.setValue(precisionValue + 0.1, { emitEvent: false });
      }
    }
  }

  populateAQIForm(parameter: string) {
    if (this.aqiConfigurations) {
      let breakpoints;
      switch (parameter) {
        case 'PM10':
          breakpoints = this.aqiConfigurations.pM10Breakpoints;
          break;
        case 'PM2.5':
          breakpoints = this.aqiConfigurations.pM25Breakpoints;
          break;
        case 'NO2':
          breakpoints = this.aqiConfigurations.nO2Breakpoints;
          break;
        case 'SO2':
          breakpoints = this.aqiConfigurations.sO2Breakpoints;
          break;
        case 'CO':
          breakpoints = this.aqiConfigurations.coBreakpoints;
          break;
        case 'O3':
          breakpoints = this.aqiConfigurations.o3Breakpoints;
          break;
        case 'NH3':
          breakpoints = this.aqiConfigurations.nH3Breakpoints;
          break;
        case 'Pb':
          breakpoints = this.aqiConfigurations.pbBreakpoints;
          break;
      }

      if (breakpoints) {
        this.aqiForm.patchValue({
          goodUpper: breakpoints[1],
          satisfactoryLower: breakpoints[2],
          satisfactoryUpper: breakpoints[3],
          moderateLower: breakpoints[4],
          moderateUpper: breakpoints[5],
          poorLower: breakpoints[6],
          poorUpper: breakpoints[7],
          verypoorLower: breakpoints[8],
          verypoorUpper: breakpoints[9],
          severeLower: breakpoints[10],
          severeUpper: breakpoints[11]
        });
      }
    }
  }

  populateTemperatureForm(data: any) {
    const temperatureConfig = this.temperatureConfigurations.find((config: any) => config.configurationId === data.configurationId);
    if (temperatureConfig) {
      this.thresholdValue = temperatureConfig.configurationThreshold;
      this.intervalTime = temperatureConfig.configurationInterval;
    }
  }

  populateOverspeedForm(data: any) {
    const overSpeedConfig = this.overSpeedConfigurations.find((config: any) => config.configurationId === data.configurationId);
    if (overSpeedConfig) {
      this.thresholdValue = overSpeedConfig.configurationThreshold;
      this.intervalTime = overSpeedConfig.configurationInterval;
    }
  }

  hasUpperBoundError(): boolean {
    for (let i = 0; i < this.categories.length - 1; i++) {
      const currentUpperControl = this.aqiForm.get(`${this.categories[i].toLowerCase().replace(' ', '')}Upper`);
      for (let j = i + 1; j < this.categories.length; j++) {
        const nextLowerControl = this.aqiForm.get(`${this.categories[j].toLowerCase().replace(' ', '')}Lower`);
        const nextUpperControl = this.aqiForm.get(`${this.categories[j].toLowerCase().replace(' ', '')}Upper`);
        if (Number(currentUpperControl?.value) >= Number(nextLowerControl?.value) || Number(currentUpperControl?.value) >= Number(nextUpperControl?.value)) {
          return true;
        }
      }
    }
    return false;
  }
}
