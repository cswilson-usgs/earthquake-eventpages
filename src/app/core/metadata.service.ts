import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Metadata service which converts and returns product metadata to json format
 */
@Injectable()
export class MetadataService {
  error: any = null;
  metadata$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient) {}

  /**
   * The multi-gmpe format received from shakemap is difficult to
   * render because the gmpes start as objects and become strings
   * at the lowest level. This function descends through the gmpes
   * and replaces the strings with look-alike gmpe objects
   *
   * @param multigmpe
   *    multigmpe value from info.json
   */
  fixMultiGmpeFormat(multigmpe: any, weight = null) {
    // fix string GMPEs
    if (typeof multigmpe === 'string') {
      multigmpe = {name: multigmpe, gmpes:[]};
    }

    // add weight property to current gmpe
    multigmpe.weight = weight;

    const newGmpes = [];
    let subGmpeWeight: number;
    multigmpe.gmpes.forEach((gmpe, index) => {
      subGmpeWeight = multigmpe.weights[index];
      newGmpes.push(this.fixMultiGmpeFormat(gmpe, subGmpeWeight));
    });

    multigmpe.gmpes = newGmpes;
    return multigmpe;
  }

  /**
   * Retreive metadata for a specifc shakemap
   *
   * @param product
   *     shakemap product json
   */
  getMetadata(product: any): void {
    if (product === null || !product.contents['download/info.json']) {
      this.onMetadata(null);
      return;
    }

    const metadata = product.contents['download/info.json'];

    this.httpClient
      .get(metadata.url)
      .pipe(catchError(this.handleError()))
      .subscribe((data: any) => {
        try {
          this.onMetadata(data);
        } catch (e) {
          /* Processing error */
          this.error = e;
          this.metadata$.next(null);
        }
      });
  }

  /**
   * Convert metadata objects to arrays by
   * assigning their key as a 'type' property
   *
   * @param obj
   *     javascript object
   * @returns
   *     Array with all metadata properties
   */
  obj2Arr(obj): any {
    const arr = [];
    for (const itemId of Object.keys(obj)) {
      const item = obj[itemId];
      item.type = itemId;

      arr.push(item);
    }
    return arr;
  }

  /**
   * Handle new instances of metadata
   *
   * @param metadata
   *     json object
   * @returns
   *     Metadata observable
   */
  onMetadata(metadata): any {
    metadata = this.translate(metadata);
    this.metadata$.next(metadata);
  }

  /**
   * Translate old metadata
   *
   * @param metadata
   *     object containing all product metadata
   * @returns
   *     Array of metadata
   */
  translate(metadata): any {
    // Which objects are not arrays in ShakeMap V3
    const needsTrans = {
      output: ['ground_motions', 'map_information'],
      processing: ['ground_motion_modules', 'roi']
    };

    for (const dataType of Object.keys(needsTrans)) {
      for (const each of needsTrans[dataType]) {
        // Convert non-array objects
        if (
          metadata &&
          metadata[dataType] &&
          metadata[dataType][each] &&
          !(metadata[dataType][each] instanceof Array)
        ) {
          metadata[dataType][each] = this.obj2Arr(metadata[dataType][each]);
        }
      }
    }

    // fix multigmpe format
    const modifiedGmpes = {};
    if (metadata && metadata.multigmpe) {
      Object.keys(metadata.multigmpe).forEach(key => {
        const fixedGmpes = this.fixMultiGmpeFormat(metadata.multigmpe[key]);
        modifiedGmpes[key] = fixedGmpes;
      });

      metadata.multigmpe.modified = modifiedGmpes;
    }
    return metadata;
  }

  /**
   * Error handler for http requests.
   *
   * @returns {any}
   */
  private handleError(): any {
    return (error: HttpErrorResponse): Observable<any> => {
      this.error = error;
      return of(null);
    };
  }
}
