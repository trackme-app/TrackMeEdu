export interface JwtPayload {
  sub: string;          // User ID
  tenantId: string;     // Tenant / School ID
  email: string;
  roles: string[];      // e.g. ["admin", "teacher"]
  iat?: number;
  exp?: number;
}