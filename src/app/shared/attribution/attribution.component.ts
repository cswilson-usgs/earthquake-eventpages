import { Component, Input } from '@angular/core';

import { ContributorService } from '../../core/contributor.service';
import { EventService } from '../../core/event.service';
import { Event } from '../../event';


/**
 * Attribution component
 * @param sourceCode
 *     The actual source code for attribution
 */
@Component({
  selector: 'shared-attribution',
  templateUrl: './attribution.component.html',
  styleUrls: ['./attribution.component.scss']
})
export class AttributionComponent {


  @Input() sourceCode: string;


  constructor (
    public readonly contributorService: ContributorService,
    public readonly eventService: EventService
  ) { }


  /**
   * Returns whether or no source has an index property
   * @param source
   * @returns {boolean}
   */
  hasIndex (source) {
    return (source.index || source.index === 0);
  }

  /**
   * Converts source code to informational data
   * @param sourceCode
   *     The source code for attribution
   * @param event
   *     The event object
   * @param details
   *     Attribution details for this event
   */
  sourceCodeToInfo (sourceCode: string, event: Event = null,
      details: Array<any> = []): any {
    let id;
    const eventSources = (event && event.sources) ? event.sources : [];

    if (!sourceCode) {
      return '';
    }

    id = sourceCode.toLowerCase();

    const detailInfo = details.find((item) => {
     return (
       item.id === id ||
       (item.aliases && item.aliases.indexOf(id) !== -1)
     );
    });

    if (detailInfo) {
      // reset id to be the mapped details id in case an alias matched
      id = detailInfo.id.toLowerCase();
    }

    return {
      id: id.toUpperCase(),
      index: eventSources.indexOf(id) + 1,
      details: detailInfo
    };
  }

}
