import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalReservations: number;
  totalVoyages: number;
  totalClients: number;
  totalRevenue: number;
}

export interface RecentReservation {
  id: number;
  date: string;
  nombrePersonnes: number;
  paid: boolean;
  confirm: boolean;
  voyage: {
    id: number;
    name: string;
    date: string;
    photo: string;
  } | null;
  user: {
    id: number;
    username: string;
    email: string;
  } | null;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = `${environment.baseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  getRecentReservations(): Observable<RecentReservation[]> {
    return this.http.get<RecentReservation[]>(
      `${this.baseUrl}/recent-reservations`
    );
  }

  getPendingCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/pending-count`);
  }

  confirmReservation(id: string): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}/reservation/confirm/${id}`,
      {}
    );
  }
}
