import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const API_DASHBOARD = environment.apiBaseLink + '/api/dashboard/';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getSalesDashboard(userId?: string) {
    return this.httpClient.get<{  message: string, success: boolean }>(API_DASHBOARD + 'admin-dashboard');
  }

}
