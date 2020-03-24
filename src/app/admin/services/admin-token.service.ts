import { Guid } from '../../utils/types';
import { Injectable } from '@angular/core';

const ADMIN_TOKEN_KEY = 'ADMIN_TOKEN';

@Injectable()
export class AdminTokenService {
  store(adminToken: AdminTokenOutput): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, JSON.stringify(adminToken));
  }

  getToken(): AdminTokenOutput | null {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    return token && JSON.parse(token);
  }

  eraseToken(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

export interface AdminTokenOutput {
  adminId: Guid;
  name: string;
  login: string;
  accessToken: string;
}
