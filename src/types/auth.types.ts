export enum UserStatus {
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export enum RefreshTokenStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED'
}

export enum RoleStatus {
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE'
}

export enum ResourceStatus {
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE'
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export interface TokenPayload {
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

export interface RefreshTokenData {
  token: string;
  expiresAt: Date;
}

export interface DeviceInfo {
  userAgent?: string;
  ip?: string;
  platform?: string;
  // Puedes añadir más campos si es necesario, como appVersion, deviceId, etc.
}
