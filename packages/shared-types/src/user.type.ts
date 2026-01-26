import { OAuthIdentity } from "./oauthIdentity.type";

export type UserStatus =
    | "pending"
    | "active"
    | "disabled"
    | "deleted";

export interface UserSettings {
    language?: string;                  // e.g. "en", "fr", "es"
    timezone?: string;                  // IANA timezone, e.g. "America/New_York"
    profilePictureUrl?: string;         // URL to profile picture
}

export type metaData = {                // Optional metadata
    [key: string]: unknown;
};

export interface User {
    readonly tenantId: string;                   // Tenant ID
    readonly id: string;                         // User ID

    firstName: string;                  // First name
    lastName: string;                   // Last name
    emailAddress: string;               // Email address
    dateOfBirth?: string;               // ISO UTC timestamp
    phoneNumber?: string;               // Phone number

    settings: UserSettings;             // User settings

    password?: string;              // Optional, only defined for local users
    oauth?: OAuthIdentity;              // Only one OAuth link per user
    status: UserStatus;                 // e.g. pending, active, disabled, deleted

    lastLoginAt?: string;               // ISO UTC timestamp
    emailVerifiedAt?: string;           // ISO UTC timestamp
    phoneNumberVerifiedAt?: string;     // ISO UTC timestamp
    termsAcceptedAt?: string;           // ISO UTC timestamp
    privacyPolicyAcceptedAt?: string;   // ISO UTC timestamp

    metaData?: metaData;                // Optional metadata
    readonly createdAt: string;                  // ISO UTC timestamp
    modifiedAt: string;                 // ISO UTC timestamp
    deletedAt?: string;                 // ISO UTC timestamp
}