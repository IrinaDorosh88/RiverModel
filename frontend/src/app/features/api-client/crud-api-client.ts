import { HttpClientQueryParams } from '@app/features/http-client-extensions';
import { Observable } from 'rxjs';
import { AbstractApiClient } from './abstract-api-client';

export interface CRUDApiClientModel {
  getEntitiesResult: unknown;
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
    this.url = `${this.apiHost}${this.path}`;
  }

  public getEntities(
    params?: HttpClientQueryParams
  ): Observable<T['getEntitiesResult'][]> {
    return this.httpClient.get<any>(this.url, { params });
  }

  public getEntity(id: number): Observable<T['getEntityResult']> {
    return this.httpClient.get(`${this.url}/${id}`);
  }

  public postEntity(
    value: T['postEntitysValue']
  ): Observable<T['postEntitysResult']> {
    return this.httpClient.post(this.url, value);
  }

  public putEntity(
    id: number,
    value: T['putEntitysValue']
  ): Observable<T['putEntityResult']> {
    return this.httpClient.put(`${this.url}/${id}`, value);
  }

  public deleteEntity(id: number): Observable<T['deleteEntitysResult']> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
}
