
import { GridModule , PDFModule, ExcelModule, } from '@progress/kendo-angular-grid';
import { Component, OnInit, AfterViewInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { fileExcelIcon, SVGIcon, filePdfIcon } from '@progress/kendo-svg-icons';
import { TemperatureService } from '../../../services/temperatureservice.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-temperature',
  standalone: true,
  imports: [GridModule ,PDFModule, ExcelModule,SVGIconModule,RouterLink,RouterOutlet],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.css'
})
export class TemperatureComponent {
  
  private temperatureService = inject(TemperatureService);
  incidentTemperature: any[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;
  lastTemperatureIncidentTime: any;
  overSpeedService: any;
 

  ngOnInit(): void {
    this.fetchTemperature();
    
  }
  ngAfterViewInit(): void {
    this.removeKendoInvalidLicense();
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
  gridData: any[] = [];

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
  

}
