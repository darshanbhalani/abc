import { Component,HostListener } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [DashboardComponent,RouterLink,RouterOutlet , CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  isClassAdded: boolean = true;
  isDropdownOpen: boolean = false;
  modalTitle: string = '';

  constructor(private modalService: NgbModal) {}

  toggleClass(): void {
    this.isClassAdded = !this.isClassAdded;
    if(!this.isClassAdded){
      this.isDropdownOpen=false;
    }
  }

  toggleDropdown() {
    if(!this.isClassAdded){
      this.isClassAdded=true;
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (window.innerWidth < 1200) {
      this.isClassAdded = false;
      if(!this.isClassAdded){
        this.isDropdownOpen=false;
      }
    }
    if (window.innerWidth > 1200) {
      this.isClassAdded = true;
    }
  }

  openModal(event:Event,content: any, title: string) {
    event.preventDefault();
    this.modalTitle = title;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title',centered: true, size: 'lg' });
  }
}
