import { JwtPayload } from './auth.type';

export function isJwtPayload(payload: unknown): payload is JwtPayload {
    if (typeof payload !== 'object' || payload === null) return false;

    const p = payload as Record<string, unknown>;

    return (
        typeof p.sub === 'string' &&
        typeof p.tenantId === 'string' &&
        typeof p.email === 'string' &&
        Array.isArray(p.roles)
    );
}
