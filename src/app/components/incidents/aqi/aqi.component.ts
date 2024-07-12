
import { GridModule , PDFModule, ExcelModule, } from '@progress/kendo-angular-grid';
import { Component, OnInit, AfterViewInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { fileExcelIcon, SVGIcon, filePdfIcon } from '@progress/kendo-svg-icons';
import { AqiService } from '../../../services/aqiservice.service';

@Component({
  selector: 'app-aqi',
  standalone: true,
  imports: [GridModule ,PDFModule, ExcelModule,SVGIconModule],
  templateUrl: './aqi.component.html',
  styleUrl: './aqi.component.css'
})
export class AqiComponent {
  
  private aqiService = inject(AqiService);
  incidentAqi: any[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;


 

  ngOnInit(): void {
    this.fetchAqi();
    
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

  async fetchAqi() {
    try {
      const data = await this.aqiService.getAllIncidents();
      if (data.success) {
        this.incidentAqi = data.body;
      
      }
    } catch (error) {
      console.error('Error fetching temperature data:', error);
    }
  }
  

}
