import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Profile} from '../../interfaces/common/profile.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from 'rxjs';

const API_NEW_EXPENSE = environment.apiBaseLink + '/api/profile/';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {
  }

  /**
   * addProfile
   * insertManyProfile
   * getAllProfiles
   * getProfileById
   * updateProfileById
   * updateMultipleProfileById
   * deleteProfileById
   * deleteMultipleProfileById
   */

  addProfile(data: Profile): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_NEW_EXPENSE + 'add', data);
  }

  getAllProfile(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Profile[];
      count: number;
      success: boolean;
      calculation: any;
    }>(API_NEW_EXPENSE + 'get-all/', filterData, {params});
  }

  getProfileById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Profile;
      message: string;
      success: boolean;
    }>(API_NEW_EXPENSE + id, {params});
  }

  updateProfileById(id: string, data: Profile) {
    return this.httpClient.put<{ message: string; success: boolean }>(
      API_NEW_EXPENSE + 'update/' + id,
      data
    );
  }

  // deleteProfileById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_NEW_EXPENSE + 'delete/' + id);
  // }

  deleteProfileById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(
      API_NEW_EXPENSE + 'delete/' + id,
      {params}
    );
  }

  deleteMultipleProfileById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(
      API_NEW_EXPENSE + 'delete-multiple',
      {ids: ids},
      {params}
    );
  }

  //  profileGroupByField<T>(dataArray: T[], field: string): ProfileGroup[] {
  //   const data = dataArray.reduce((group, product) => {
  //     const uniqueField = product[field]
  //     group[uniqueField] = group[uniqueField] ?? [];
  //     group[uniqueField].push(product);
  //     return group;
  //   }, {});
  //
  //   const final = [];
  //
  //   for (const key in data) {
  //     final.push({
  //       _id: key,
  //       data: data[key]
  //     })
  //   }
  //
  //   return final as ProfileGroup[];

  // }
}
