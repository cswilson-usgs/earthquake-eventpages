import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { FormatterService } from '@core/formatter.service';

/**
 * Technical origin component
 * @param event
 *     The event input
 * @param products
 *     The products array
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'technical-origin-summary',
  styleUrls: ['./origin-summary.component.scss'],
  templateUrl: './origin-summary.component.html'
})
export class OriginSummaryComponent {
  // Table headers
  columnsToDisplay = [
    'catalog',
    'magnitude',
    'time',
    'depth',
    'status',
    'location',
    'source'
  ];

  @Input()
  event: any;

  @Input()
  products: Array<any>;

  // router information
  router: Router;

  constructor(public formatterService: FormatterService, router: Router) {
    this.router = router;
  }

  /**
   * Returns a date object from a string
   * @param str
   *     String input used to create Date object
   * @returns {Date}
   */
  toDate(str: string) {
    return new Date(str);
  }
}
