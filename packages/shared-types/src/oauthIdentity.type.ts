export type OAuthProviderType =
    | "google"
    | "microsoft"
    | "apple"
    | "facebook"
    | "github"
    | "custom";

export interface OAuthIdentity {
    provider: OAuthProviderType;
    providerUserId: string;      // Unique ID from the provider
    email?: string;              // Email from provider (may differ from primary)
    accessToken?: string;        // Optional, if you store it
    refreshToken?: string;       // Optional, if you store it
    connectedAt: string;         // ISO timestamp
}