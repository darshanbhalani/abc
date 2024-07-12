import { Component, OnInit, AfterViewInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CircularCounterComponent } from '../circular-counter/circular-counter.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { SwitchModule, InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AqiService } from '../../services/aqiservice.service';
import { OverSpeedService } from '../../services/overspeedservice.service';
import { TemperatureService } from '../../services/temperatureservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CircularCounterComponent,
    GridModule,
    SwitchModule,
    FormsModule,
    DropDownsModule,
    InputsModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private aqiService = inject(AqiService);
  private overSpeedService = inject(OverSpeedService);
  private temperatureService = inject(TemperatureService);
  private cdr = inject(ChangeDetectorRef);

  isGridVisible: boolean = false;
  isAutoSync: boolean = false;
  incidentAQI: any[] = [];
  incidentOverSpeed: any[] = [];
  incidentTemperature: any[] = [];
  gridColumns: any[] = [];
  gridData: any[] = [];
  sort: any[] = [{ field: 'createdOn', dir: 'desc' }];
  lastOverspeedIncidentTime: string | null = null;
  lastTemperatureIncidentTime: string | null = null;
  lastAqiIncidentTime: string | null = null;
  title: string | null = null;
  checked: boolean = false;
  private intervalId: any;
  private isSyncing: boolean = false;

  intervalValue: number = 60000;

  syncIntervals = [
    { text: '1 minute', value: 60000 },
    { text: '5 minutes', value: 300000 },
    { text: '10 minutes', value: 600000 }
  ];

  ngOnInit(): void {
    this.fetchOverspeed();
    this.fetchTemperature();
    this.fetchAQI();
  }

  ngAfterViewInit(): void {
    this.removeKendoInvalidLicense();
    // if (this.checked) {
    //   this.autoSync(); // Avoid frequent calls and ensure it only triggers once
    // }
  }

  ngOnDestroy(): void {
    this.stopAutoSync();
  }


  onIntervalChange(newInterval: number) {
    this.intervalValue = newInterval;
    this.autoSync(); // Restart auto-sync with new interval
    console.log(`Interval changed to ${newInterval / 1000} seconds.`);
  }
  public onSwitchChange(isChecked: boolean): void {
    if (isChecked) {
      this.autoSync();
    } else {
      this.stopAutoSync();
    }
  }

  private removeKendoInvalidLicense() {
    setTimeout(() => {
      const banner = Array.from(document.querySelectorAll('div')).find(el =>
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

  private autoSync() {
    this.stopAutoSync(); // Clear any existing interval
    this.intervalId = setInterval(() => {
      if (!this.isSyncing) {
        this.syncData();
      } else {
        console.log("Sync operation already in progress. Skipping this interval.");
      }
    }, this.intervalValue); // 1 minute interval
    console.log("Auto-sync started with 1 minute interval.");
  }

  private stopAutoSync() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Auto-sync stopped.");
    }
  }

  public async syncData() {
    if (this.isSyncing) {
      console.log("Sync operation already in progress. Skipping this call.");
      return;
    }

    this.isSyncing = true;
    console.log("Sync operation started...");

    try {
      const overSpeedData = await this.overSpeedService.syncNewIncidents(this.lastOverspeedIncidentTime || '');
      if (overSpeedData.success && overSpeedData.body.length > 0) {
        this.incidentOverSpeed.push(...overSpeedData.body);
        this.lastOverspeedIncidentTime = overSpeedData.lastExecutionTime;
      }

      const temperatureData = await this.temperatureService.syncNewIncidents(this.lastTemperatureIncidentTime || '');
      if (temperatureData.success && temperatureData.body.length > 0) {
        this.incidentTemperature.push(...temperatureData.body);
        this.lastTemperatureIncidentTime = temperatureData.lastExecutionTime;
      }

      const aqiData = await this.aqiService.getAllIncidents();
      if (aqiData.success) {
        this.incidentAQI = aqiData.body;
        this.lastAqiIncidentTime = aqiData.lastExecutionTime;
      }

      console.log("Data refreshed successfully.");
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      this.isSyncing = false;
      console.log("Sync operation status reset.");
    }
  }

  async fetchOverspeed() {
    try {
      const data = await this.overSpeedService.getAllIncidents();
      if (data.success) {
        this.incidentOverSpeed = data.body;
        this.lastOverspeedIncidentTime = data.lastExecutionTime;
      }
    } catch (error) {
      console.error('Error fetching overspeed data:', error);
    }
  }

  async fetchTemperature() {
    try {
      const data = await this.temperatureService.getAllIncidents();
      if (data.success) {
        this.incidentTemperature = data.body;
        this.lastTemperatureIncidentTime = data.lastExecutionTime;
      }
    } catch (error) {
      console.error('Error fetching temperature data:', error);
    }
  }

  async fetchAQI() {
    try {
      const data = await this.aqiService.getAllIncidents();
      if (data.success) {
        this.incidentAQI = data.body;
        this.lastAqiIncidentTime = data.lastExecutionTime;
      }
    } catch (error) {
      console.error('Error fetching AQI data:', error);
    }
  }

  showOverspeedGrid() {
    this.title = "Overspeed";
    this.gridData = this.incidentOverSpeed;
    this.gridColumns = [
      { field: 'vehicleNumber', title: 'Vehicle Number' },
      { field: 'averageSpeed', title: 'AverageSpeed' },
      { field: 'thresholdSpeed', title: 'ThresholdSpeed' },
      { field: 'interval', title: 'Interval' },
      { field: 'authority', title: 'Authority' },
      { field: 'city', title: 'City' },
      { field: 'state', title: 'State' },
      { field: 'startTime', title: 'Start Time' },
      { field: 'endTime', title: 'End Time' }
    ];
    this.isGridVisible = true;
  }

  showTemperatureGrid() {
    this.title = "Temperature";
    this.gridData = this.incidentTemperature;
    this.gridColumns = [
      { field: 'pollNumber', title: 'Poll Number' },
      { field: 'description', title: 'Description' },
      { field: 'startTime', title: 'Start Time' },
      { field: 'endTime', title: 'End Time' }
    ];
    this.isGridVisible = true;
  }

  showAQIGrid() {
    this.title = "AQI";
    this.gridData = this.incidentAQI;
    this.gridColumns = [
      { field: 'area', title: 'Area' },
      { field: 'avg_AQI', title: 'AQI' },
      { field: 'category', title: 'Category' },
      { field: 'city', title: 'City' },
      { field: 'state', title: 'State' },
      { field: 'startTime', title: 'Start Time' },
      { field: 'endTime', title: 'End Time' }
    ];
    this.isGridVisible = true;
  }

  public pageableSettings: any = {
    buttonCount: 5,
    info: true,
    type: 'numeric',
    pageSizes: [10, 20, 40, 50, 100, 'All'],
    previousNext: true
  };
}
