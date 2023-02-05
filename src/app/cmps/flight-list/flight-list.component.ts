import { Component,Input } from '@angular/core';
import { Flight } from 'src/app/models/flight.model';

@Component({
  selector: 'flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent {
  @Input() flights!: Flight[] | null
}
