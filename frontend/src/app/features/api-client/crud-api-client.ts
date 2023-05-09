import { HttpClientQueryParams } from '@/features/http-client-extensions';
import { Observable, map } from 'rxjs';
import { AbstractApiClient } from './abstract-api-client';

export interface CRUDApiClientModel {
  getEntitiesResult: unknown;
  getPaginatedEntitiesResult: unknown;
  getEntityResult: unknown;
  postEntitysResult: unknown;
  postEntitysValue: any;
  putEntityResult: unknown;
  putEntitysValue: any;
  deleteEntitysResult: unknown;
}

export abstract class CRUDApiClient<
  T extends CRUDApiClientModel = CRUDApiClientModel
> extends AbstractApiClient {
  private url: string;

  constructor(private path: string) {
    super();
    this.url = `${this.apiHost}/${this.path}/`;
  }

  public getEntities(
    params?: HttpClientQueryParams
  ): Observable<T['getEntitiesResult'][]> {
    if (params) {
      delete params['limit'];
      delete params['offset'];
    }
    return this.httpClient.get<any>(this.url, { params }).pipe(
      map((next) => {
        if (!(next instanceof Array)) {
          return next.data;
        }
        return next;
      })
    );
  }

  public getPaginatedEntities(
    params?: HttpClientQueryParams
  ): Observable<T['getPaginatedEntitiesResult']> {
    return this.httpClient.get<any>(this.url, { params }).pipe(
      map((next) =>
        next instanceof Array
          ? {
              data: next,
              count: next.length,
            }
          : next
      )
    );
  }

  public getEntity(id: number): Observable<T['getEntityResult']> {
    return this.httpClient.get(`${this.url}${id}/`);
  }

  public postEntity(
    value: T['postEntitysValue']
  ): Observable<T['postEntitysResult']> {
    return this.httpClient.post(this.url, value);
  }

  public patchEntity(
    id: number,
    value: T['putEntitysValue']
  ): Observable<T['putEntityResult']> {
    return this.httpClient.patch(`${this.url}${id}/`, value);
  }

  public deleteEntity(id: number): Observable<T['deleteEntitysResult']> {
    return this.httpClient.delete(`${this.url}${id}/`);
  }
}
