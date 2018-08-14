import { Component, Input } from '@angular/core';

import { Event } from '../../event';

/**
 * Regional Information Pin
 *
 * @param event
 *     event object
 */
@Component({
  selector: 'executive-region-info-pin',
  templateUrl: './region-info-pin.component.html',
  styleUrls: ['./region-info-pin.component.scss']
})
export class RegionInfoPinComponent {
  link = '../region-info';
  title = 'Regional Information';

  @Input()
  event: Event;
}
