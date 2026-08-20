import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_BASE_URL } from '../api-base-url.token';

export interface SubscribeResult {
  subscribed: boolean;
  alreadySubscribed: boolean;
}

export interface BroadcastResult {
  queued: number;
}

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private http = inject(HttpClient);
  private baseUrl = `${inject(API_BASE_URL)}/newsletter`;

  subscribe(email: string): Observable<SubscribeResult> {
    return this.http.post<SubscribeResult>(
      `${this.baseUrl}/subscribe`,
      { email },
      { withCredentials: true },
    );
  }

  broadcast(
    subject: string,
    message: string,
    ctaLink?: string,
    ctaText?: string,
  ): Observable<BroadcastResult> {
    return this.http.post<BroadcastResult>(
      `${this.baseUrl}/broadcast`,
      { subject, message, ctaLink, ctaText },
      { withCredentials: true },
    );
  }
}