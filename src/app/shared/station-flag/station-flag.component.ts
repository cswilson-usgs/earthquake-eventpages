import { Component, Input } from '@angular/core';

/**
 * Shows a flag description for each station
 *
 * @param flag
 *     The flag
 */
@Component({
  selector: 'shared-station-flag',
  templateUrl: './station-flag.component.html',
  styleUrls: ['./station-flag.component.scss']
})
export class StationFlagComponent {
  @Input()
  flag: string;

  readonly FLAG_DESCRIPTIONS = {
    M: 'Manually flagged',
    T: 'Outlier',
    G: 'Glitch (clipped or below noise)',
    I: 'Incomplete time series',
    N: 'Not in list of known stations'
  };
}
