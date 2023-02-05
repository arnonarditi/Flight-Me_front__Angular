import { Segment } from "./segment.model"

export interface Flight {
    ID: string,
    Segments: Array<Segment>,
    AveragePrice: number,
    CurrencySymbol: string
}

export interface FlightFilter {
    isOW: boolean,
    companies:string[],
    minPrice:number,
    maxPrice:number,
    stops:number[],
    page:number,
    pageSize:number
}

export interface FilterRanges{
    companies:string[],
    minPrice:number,
    maxPrice:number,
    stops:number[]
}




