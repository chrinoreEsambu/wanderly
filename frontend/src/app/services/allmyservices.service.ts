import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { identifierName } from '@angular/compiler';
import { identity } from 'rxjs';
import id from '@angular/common/locales/id';

@Injectable({
  providedIn: 'root',
})
export class AllmyservicesService {
  constructor(private http: HttpClient) {}

  AllCategories() {
    return this.http.get(`${environment.baseUrl}/category/list`);
  }

  oneCategorie(id: String) {
    return this.http.get(`${environment.baseUrl}/category/getOne/${id}`);
  }

  deleteCategorie(id: String) {
    return this.http.delete(`${environment.baseUrl}/category/delete/${id}`);
  }

  updateCategorie(data: any, id: String) {
    return this.http.put(`${environment.baseUrl}/category/update/${id}`, data);
  }

  addCategorie(data: any) {
    return this.http.post(`${environment.baseUrl}/category/create`, data);
  }

  Allusers() {
    return this.http.get(`${environment.baseUrl}/user/list`);
  }

  oneUser(id: String) {
    return this.http.get(`${environment.baseUrl}/user/getOne/${id}`);
  }

  deleteUser(id: String) {
    return this.http.delete(`${environment.baseUrl}/user/delete/${id}`);
  }

  updateUser(data: any, id: String) {
    return this.http.put(`${environment.baseUrl}/user/update/${id}`, data);
  }

  addUser(data: any) {
    return this.http.post(`${environment.baseUrl}/user/create`, data);
  }

  Allvoyages() {
    return this.http.get(`${environment.baseUrl}/voyage/list`);
  }

  oneVoyage(id: String) {
    return this.http.get(`${environment.baseUrl}/voyage/getOne/${id}`);
  }

  deleteVoyage(id: String) {
    return this.http.delete(`${environment.baseUrl}/voyage/delete/${id}`);
  }

  updateVoyage(data: any, id: String) {
    return this.http.put(`${environment.baseUrl}/voyage/update/${id}`, data);
  }

  addVoyage(data: any, idcat: String) {
    return this.http.post(
      `${environment.baseUrl}/voyage/create/${idcat}`,
      data
    );
  }

  Allreservations() {
    return this.http.get(`${environment.baseUrl}/reservation/list`);
  }

  oneReservation(id: String) {
    return this.http.get(`${environment.baseUrl}/reservation/getOne/${id}`);
  }

  deleteReservation(id: String) {
    return this.http.delete(`${environment.baseUrl}/reservation/delete/${id}`);
  }

  updateReservation(data: any, id: String, userId: String) {
    return this.http.put(
      `${environment.baseUrl}/reservation/update/${id}/${userId}`,
      data
    );
  }

  addReservation(
    data: any,
    iduser: String,
    voyageId?: String,
    categoryId?: String
  ) {
    if (voyageId && categoryId) {
      return this.http.post(
        `${environment.baseUrl}/reservation/create/${iduser}/${voyageId}/${categoryId}`,
        data
      );
    }
    return this.http.post(
      `${environment.baseUrl}/reservation/create/${iduser}`,
      data
    );
  }

  addReservationManual(
    data: any,
    iduser: String,
    voyageId: String,
    categoryId: String
  ) {
    return this.http.post(
      `${environment.baseUrl}/reservation/create-manual/${iduser}/${voyageId}/${categoryId}`,
      data
    );
  }

  getUserReservations(userId: String) {
    return this.http.get(`${environment.baseUrl}/reservation/user/${userId}`);
  }

  getRecentReservations() {
    return this.http.get(
      `${environment.baseUrl}/dashboard/recent-reservations`
    );
  }

  confirmReservation(id: String) {
    return this.http.put(
      `${environment.baseUrl}/reservation/confirm/${id}`,
      {}
    );
  }

  login(data: any) {
    return this.http.post(`${environment.baseUrl}/user/signin`, data);
  }

  httpOptions: any;
  logout() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer` + ` ` + localStorage.getItem('token'),
      }),
    };
    return this.http.get(
      `${environment.baseUrl}/user/signout`,
      this.httpOptions
    );
  }
}
