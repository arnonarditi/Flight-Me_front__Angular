import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { Flight, FlightFilter, FilterRanges } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  // _baseFlights$ are the overall flights back from req
  private _baseFlights$ = new BehaviorSubject<Flight[]>([])
  // _filteredFlights$ are the filteredFlights
  private _filteredFlights$ = new BehaviorSubject<Flight[]>([])
  // _flights$ are the filteredFlights and sliced by page state
  private _flights$ = new BehaviorSubject<Flight[]>([])
  public flights$ = this._flights$.asObservable()

  private _flightFilter$ = new BehaviorSubject<FlightFilter>({ isOW: true, companies: [], minPrice: 0, maxPrice: Infinity, stops: [], page: 0, pageSize: 24 })
  public flightFilter$ = this._flightFilter$.asObservable()

  private _filterRanges$ = new BehaviorSubject<FilterRanges>({ companies: [], minPrice: Infinity, maxPrice: -Infinity, stops: [] })
  public filterRanges$ = this._filterRanges$.asObservable()

  private _totalResults$ = new BehaviorSubject<number>(0)
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

      this._baseFlights$.next(this._setCustomPrice(res.data))
      this._setFilterRanges(this._baseFlights$.value)
      this._filter(filterBy, this._baseFlights$.value)
    } catch (err) {
      console.log(err)
    }
  }

  private _setCustomPrice(flights: Flight[]): Flight[] {
    flights = flights.map(flight => {
      // as said- even if just one direction is El Al flight--> plus $50 to the avg price
      const isSomeElAl = flight.Segments.some(segment => {
        return segment.Legs.every(leg => {
          return leg.AirlineName === 'El Al '
        })
      })
      if (isSomeElAl) flight.AveragePrice += 50
      return flight
    })

    return flights
  }

  // Filter function
  private _filter(filterBy: FlightFilter, flights: Flight[]) {
    let { companies, minPrice, maxPrice, stops, page, pageSize } = filterBy

    flights = flights.filter(flight => {
      if (flight.AveragePrice > maxPrice || flight.AveragePrice < minPrice) return false
      if (stops.length || companies.length) {

        return flight.Segments.every(segment => {
          if (stops.length && companies.length) {
            return stops.includes(segment.Legs.length - 1) && segment.Legs.every(leg => companies.includes(leg.AirlineName))
          } else if (stops.length) {
            return stops.includes(segment.Legs.length - 1)
          } else if (companies.length) {
            return segment.Legs.every(leg => companies.includes(leg.AirlineName))
          }
          return true
        })
      }

      return true
    })

    this._totalResults$.next(flights.length)
    this._filteredFlights$.next(flights)
    this._flights$.next(flights.slice(0, pageSize))
  }

  // when change track pattern--> loadFlights with http req
  public setFilterAndLoad(flightFilter: FlightFilter) {
    this._flightFilter$.next(flightFilter)
    this.loadFlights()
  }
  public setFilter(flightFilter: FlightFilter) {
    this._flightFilter$.next(flightFilter)
    this._filter(flightFilter, this._baseFlights$.value)
  }
  public setPage(filterBy: FlightFilter) {
    const { page, pageSize } = filterBy
    const startIdx = page * pageSize
    const endIdx = startIdx + pageSize
    const flights = this._filteredFlights$.value

    this._flightFilter$.next(filterBy)
    this._flights$.next(flights.slice(startIdx, endIdx))
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
}


