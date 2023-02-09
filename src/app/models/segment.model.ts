import { Leg } from './leg.model'

export interface Segment {
    Legs: Array<Leg>,
    SegmentDuration: number,
    ValidatingCarrier: string
}