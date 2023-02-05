import { Component, Input } from '@angular/core';
import { Segment } from 'src/app/models/segment.model';
@Component({
  selector: 'segment-preview',
  templateUrl: './segment-preview.component.html',
  styleUrls: ['./segment-preview.component.scss']
})
export class SegmentPreviewComponent {
  @Input() segment!: Segment | null

  isTrackOpen: boolean = false

  toggleIsTrack() {
    this.isTrackOpen = !this.isTrackOpen
  }
}
