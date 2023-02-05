import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { Flight, FlightFilter, FilterRanges } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private _flights$ = new BehaviorSubject<Flight[]>([])
  public flights$ = this._flights$.asObservable()

  private _flightFilter$ = new BehaviorSubject<FlightFilter>({ isOW: true, companies: [], minPrice: 0, maxPrice: Infinity, stops: [], page: 0, pageSize: 24 })
  public flightFilter$ = this._flightFilter$.asObservable()

  private _filterRanges$ = new BehaviorSubject<FilterRanges>({ companies: [], minPrice: Infinity, maxPrice: -Infinity, stops: [] })
  public filterRanges$ = this._filterRanges$.asObservable()

  private _totalResults$ = new BehaviorSubject<number>(200)
  public totalResults$ = this._totalResults$.asObservable()

  constructor() { }

  public async loadFlights(): Promise<void> {
    const filterBy = this._flightFilter$.value
    try {
      const res = await axios({
        url: 'http://localhost:3030/api/flight/search',
        method: 'GET',
        params: { isOW: filterBy.isOW }
      })

      this._setFilterRanges(res.data)
      const filteredFlights = this._filter(filterBy, res.data)
      this._flights$.next(filteredFlights)

    } catch (err) {
      console.log(err)
    }
  }

  private _filter(filterBy: FlightFilter, flights: Flight[]): Flight[] {
    let { companies, minPrice, maxPrice, stops, page, pageSize } = filterBy
    const startIdx = page * pageSize
    const endIdx = startIdx + pageSize

    flights = flights.filter(flight => {
      if (flight.AveragePrice > maxPrice || flight.AveragePrice < minPrice) return false

      if (stops.length) {
        // every to eliminate the rt's which maybe will be with some stops which are'nt acceptable in one of the segments
        return flight.Segments.every(segment => {
          return stops.includes(segment.Legs.length - 1)
        })
      }
      return true
    })
    // && filter by user comps choice
    flights = flights.filter(flight => {
      if (companies.length) {
        return flight.Segments.every(segment => {
          return segment.Legs.every(leg => companies.includes(leg.AirlineName))
        })
      }
      return true
    })

    this._totalResults$.next(flights.length)
    return flights.slice(startIdx, endIdx)
  }

  private _setFilterRanges(flights: Flight[]): void {
    let companies: string[] = [], stops: number[] = [], minPrice: number = Infinity, maxPrice: number = -Infinity
    let airlineMap: any = {}, stopsMap: any = {}

    flights.forEach(flight => {
      if (minPrice > flight.AveragePrice) minPrice = flight.AveragePrice
      if (maxPrice < flight.AveragePrice) maxPrice = flight.AveragePrice

      flight.Segments.forEach(segment => {
        segment.Legs.forEach((leg, idx) => {
          if (stopsMap[idx] === undefined) {
            stopsMap[idx] = idx
            stops.push(idx)
          }

          if (!airlineMap[leg.AirlineName]) {
            airlineMap[leg.AirlineName] = leg.AirlineName
            companies.push(leg.AirlineName)
          }
        })
      })

    })

    this._filterRanges$.next({ companies, minPrice, maxPrice, stops })
  }

  public setFilter(flightFilter: FlightFilter) {
    this._flightFilter$.next(flightFilter)
    this.loadFlights()
  }
}






