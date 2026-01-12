export interface TenantSettings {
    data_residency_region: string; //AWS Region to store data in
    encryption_required: boolean; // Whether encryption is required for data at rest and in transit
    mfa_required: boolean; // Whether MFA is required for all users
    audit_retention_days: number; // Number of days to retain audit logs
    data_retention_days: number; // Number of days to retain data
    ip_whitelist_enabled: boolean; // Whether IP whitelisting is enabled
    ip_whitelist: string[]; // List of IP addresses to whitelist
    colour_scheme: {
        background_lightmode: string | null;
        foreground_lightmode: string | null;
        alt_lightmode: string | null;
        nav_lightmode: string | null;
        border_lightmode: string | null;

        background_darkmode: string | null;
        foreground_darkmode: string | null;
        alt_darkmode: string | null;
        nav_darkmode: string | null;
        border_darkmode: string | null;
    };
}