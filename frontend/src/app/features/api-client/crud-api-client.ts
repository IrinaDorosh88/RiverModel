import { HttpClientQueryParams } from '@/features/http-client-extensions';
import { Observable, map } from 'rxjs';

import { PaginatedData } from '@/features/paginated-data';

import { AbstractApiClient } from './abstract-api-client';

export interface CRUDApiClientModel {
  getEntitiesResult: unknown;
  getPaginatedEntitiesResult: unknown;
  getEntityResult: unknown;
  postEntityResult: unknown;
  postEntityValue: any;
  patchEntityResult: unknown;
  patchEntityValue: any;
  deleteEntityResult: unknown;
}

export abstract class CRUDApiClient<
  T extends CRUDApiClientModel = CRUDApiClientModel
> extends AbstractApiClient {
  private url: string;

  constructor(private path: string) {
    super();
    this.url = `${this.apiHost}/${this.path}`;
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
  ): Observable<PaginatedData<T['getPaginatedEntitiesResult']>> {
    return this.httpClient.get<any>(this.url, { params }).pipe(
      map((next) =>
        next instanceof Array
          ? {
              data: next,
              total: next.length,
            }
          : next
      )
    );
  }

  public getEntity(id: number): Observable<T['getEntityResult']> {
    return this.httpClient.get(`${this.url}/${id}`);
  }

  public postEntity(
    value: T['postEntityValue']
  ): Observable<T['postEntityResult']> {
    return this.httpClient.post(this.url, value);
  }

  public patchEntity(
    id: number,
    value: T['patchEntityValue']
  ): Observable<T['patchEntityResult']> {
    return this.httpClient.patch(`${this.url}/${id}`, value);
  }

  public deleteEntity(id: number): Observable<T['deleteEntityResult']> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
}
