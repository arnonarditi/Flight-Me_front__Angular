import { Component, OnInit } from '@angular/core';
import { FlightService } from '../services/flight.service';
import { Observable } from 'rxjs'
import { Flight, FilterRanges } from '../models/flight.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private flightService: FlightService) { }

  flights$!: Observable<Flight[]>
  filterRanges$!: Observable<FilterRanges>

  async ngOnInit(): Promise<void> {
    await this.flightService.loadFlights()
    this.flights$ = this.flightService.flights$
    this.filterRanges$ = this.flightService.filterRanges$

  }
}
