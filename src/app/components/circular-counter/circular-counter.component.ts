import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-circular-counter',
  standalone: true,
  imports: [],
  templateUrl: './circular-counter.component.html',
  styleUrl: './circular-counter.component.css',
  inputs:['title','count']
})
export class CircularCounterComponent {
  title:any;
  count:any;
}
