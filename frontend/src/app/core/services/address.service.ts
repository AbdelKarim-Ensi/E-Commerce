import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Address, CreateAddressPayload, UpdateAddressPayload } from '@models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/addresses`;

  getAll(): Observable<Address[]> {
    return this.http.get<Address[]>(this.baseUrl, { withCredentials: true });
  }

  create(payload: CreateAddressPayload): Observable<Address> {
    return this.http.post<Address>(this.baseUrl, payload, { withCredentials: true });
  }

  update(id: string, payload: UpdateAddressPayload): Observable<Address> {
    return this.http.patch<Address>(`${this.baseUrl}/${id}`, payload, {
      withCredentials: true,
    });
  }

  setDefault(id: string): Observable<Address> {
    return this.http.patch<Address>(
      `${this.baseUrl}/${id}/default`,
      {},
      { withCredentials: true },
    );
  }

  remove(id: string): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }
}