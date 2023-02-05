import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FlightFilter, FilterRanges } from 'src/app/models/flight.model';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'flight-filter',
  templateUrl: './flight-filter.component.html',
  styleUrls: ['./flight-filter.component.scss']
})

export class FlightFilterComponent implements OnInit {
  constructor(private flightService: FlightService,) { }
  @Input() filterRanges!: FilterRanges | null
  @ViewChild('maxPrice', { static: false }) maxPrice!: ElementRef;

  subscription!: Subscription
  flightFilter!: FlightFilter
  totalResults!: number

  isStopsOpen: boolean = false
  isCompsOpen: boolean = false

  ngAfterViewInit(): void {
    console.log()
  }

  ngOnInit(): void {
    this.subscription = this.flightService.flightFilter$.subscribe(flightFilter => {
      this.flightFilter = flightFilter
    })
    this.subscription = this.flightService.totalResults$.subscribe(res => {
      this.totalResults = res
    })
  }

  // Filter handlers
  onSetPriceRange() {
    this.flightFilter.page = 0
    this.flightService.setFilter(this.flightFilter)
  }

  setPage(diff: number) {
    this.flightFilter.page += diff
    this.flightService.setFilter(this.flightFilter)
  }

  onSelectPattern(value: string): void {
    if (value === 'one-way') this.flightFilter.isOW = true
    else this.flightFilter.isOW = false

    this.flightFilter.page = 0
    this.flightService.setFilter(this.flightFilter)
  }

  onToggleStopOpt(ev: Event, stop: number) {
    const target = ev.target as HTMLInputElement
    const { stops } = this.flightFilter
    // when user cancel some stop obligation
    if (!target.checked) {
      const idx = stops.findIndex(s => s === stop)
      stops.splice(idx, 1)
    } else stops.push(stop)

    this.flightFilter.page = 0
    this.flightService.setFilter(this.flightFilter)
  }

  onToggleCompOpt(ev: Event, company: string) {
    const target = ev.target as HTMLInputElement
    const { companies } = this.flightFilter
    if (!target.checked) {
      const idx = companies.findIndex(c => c === company)
      companies.splice(idx, 1)
    } else companies.push(company)

    this.flightFilter.page = 0
    this.flightService.setFilter(this.flightFilter)
  }

}
