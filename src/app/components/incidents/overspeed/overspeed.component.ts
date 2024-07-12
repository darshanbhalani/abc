
import { OverSpeedService } from '../../../services/overspeedservice.service';
import { GridModule , PDFModule, ExcelModule, } from '@progress/kendo-angular-grid';
import { Component, OnInit, AfterViewInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { fileExcelIcon, SVGIcon, filePdfIcon } from '@progress/kendo-svg-icons';
import { ButtonsModule } from '@progress/kendo-angular-buttons'; 
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-overspeed',
  standalone: true,
  imports: [GridModule ,PDFModule, ExcelModule,SVGIconModule , ButtonsModule,RouterLink,RouterOutlet],
  templateUrl: './overspeed.component.html',
  styleUrl: './overspeed.component.css'
})
export class OverspeedComponent {


  private overSpeedService = inject(OverSpeedService);
  incidentOverSpeed: any[] = [];
  lastOverspeedIncidentTime: any;
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;

  ngOnInit(): void {
    this.fetchOverspeed();
    
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

}
