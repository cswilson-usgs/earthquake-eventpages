import { Component, Input } from '@angular/core';

/**
 * Ground Failure Pin
 */
@Component({
  selector: 'executive-ground-failure-pin',
  templateUrl: './ground-failure-pin.component.html',
  styleUrls: ['./ground-failure-pin.component.scss']
})
export class GroundFailurePinComponent {
  link = '../ground-failure';
  title = 'Ground Failure';

  @Input()
  product: any;
}
