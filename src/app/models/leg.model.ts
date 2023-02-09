
export interface Leg {
    DeparturePoint: DeparturePoint,
    ArrivalPoint: ArrivalPoint,
    FlightNumber: string,
    AirlineName: string,
    AirlineCode: string
}

interface DeparturePoint {
    AirportName: string,
    AirportCode: string,
    City: string,
    DateTime: string

}

interface ArrivalPoint {
    AirportName: string,
    AirportCode: string,
    City: string,
    DateTime: string
}
