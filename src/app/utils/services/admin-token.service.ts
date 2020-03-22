import { RootInjectable } from '../../app.module';

@RootInjectable()
export class AdminTokenService {
  private readonly ADMIN_TOKEN_KEY = 'ADMIN_TOKEN';

  store(adminToken: AdminTokenOutput): void {
    localStorage.setItem(this.ADMIN_TOKEN_KEY, JSON.stringify(adminToken));
  }

  getToken(): AdminTokenOutput | null {
    const token = localStorage.getItem(this.ADMIN_TOKEN_KEY);

    return token && JSON.parse(token);
  }
}

export interface AdminTokenOutput {
  adminId: Guid;
  name: string;
  login: string;
  accessToken: string;
}
