import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type HttpClientQueryParams = HttpClient['get'] extends (
  url: string,
  options: { params: HttpParams | infer Type }
) => Observable<any>
  ? Type
  : never;
